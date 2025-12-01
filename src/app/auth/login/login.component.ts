import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthHTTPService } from '../auth-http.service';
import { AuthService } from '../auth.service';
import { ToastService } from '../../@shared/services/toast/toast.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  hasPassword = false;
  forcelogin = false;
  checked = false;
  isLoading: boolean = false;

  shopMobilePopup: boolean = true;
  showConfiirmCodePopup = false;
  showLoginWithPasswordPopup = false;

  checkMobileForm!: FormGroup;
  verificationCodeForm!: FormGroup;
  setPasswordForm!: FormGroup;
  passwordForm!: FormGroup;

  setPassword: boolean = false;
  hasAccount!: boolean;
  oldUserLoginWithPassword: boolean = true;
  isMobileEntered: boolean = false;
  verificationCodeExpired = false;

  showForgotPasswordPopup: boolean = false;
  forgotPasswordForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private authHTTPService: AuthHTTPService,
    private authService: AuthService
  ) {
    this.createLoginForm();
    this.createVerifyCodeForm();
    this.createPasswordForm();
    this.createSetPasswordForm();
    this.createForgotPasswordForm();
  }
  ngOnInit(): void {}

  OnEditMobile() {
    this.reseAllForms();
    this.isMobileEntered = false;

    this.shopMobilePopup = true;
    this.showConfiirmCodePopup = false;
    this.showLoginWithPasswordPopup = false;
  }

  reseAllForms() {
    this.checkMobileForm.reset(); // Clear mobile number
    this.checkMobileForm.enable(); // Enable input field
    this.verificationCodeForm.reset(); // Reset verification form
    this.passwordForm.reset(); // Reset password form
  }

  timer: number = 0;
  displayedTimer: string = '02:00';
  resendDisabled: boolean = true;

  startTimer() {
    this.timer = 120;
    this.resendDisabled = true;
    var interval = setInterval(() => {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;

      this.displayedTimer = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`; // به‌روز رسانی تایمر

      this.timer--;

      if (this.timer === 0) {
        clearInterval(interval);
        this.displayedTimer = '00:00'; // زمانی که تایمر به پایان
        this.resendDisabled = false; // Enable resend button
      }
    }, 1000);
    this.resendDisabled = true; // Disable resend button when timer starts
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  passwordFieldType: string = 'password';
  passwordSecondFieldType: string = 'password';

  togglePasswordSecondVisibility() {
    this.passwordSecondFieldType =
      this.passwordSecondFieldType === 'password' ? 'text' : 'password';
  }

  oldUserLoginWithPasswordButton() {
    // this.showLoginWithPasswordPopup = false;
    // this.reseAllForms();
    this.showLoginWithPasswordPopup = false;
    this.showConfiirmCodePopup = true;
    this.sendMobileNumberToAPI(true);
  }
  forgotPassword() {
    this.showLoginWithPasswordPopup = false;
    this.showForgotPasswordPopup = true;
    this.sendMobileNumberToAPI(false);
    this.forgotPasswordForm.get('mobile')?.setValue(this.checkMobileForm.value.mobile);
  }

  sendMobileNumberToAPI(loginBySms: boolean) {
    this.isLoading = true;
    if (this.checkMobileForm.invalid) {
      this.toastService.error('شماره موبایل نا معتبر است');
      this.isLoading = false;
      return;
    }
    this.checkMobileForm.get('mobile')?.disable();

    const data = {
      mobile: this.checkMobileForm.value.mobile,
      loginBySms: loginBySms,
      forget_password: this.showForgotPasswordPopup,
    };

    this.authHTTPService.checkmoobile(data).subscribe({
      next: (response) => {
        this.hasPassword = response.data.hasPassword;
        /// for handling which pop up to show
        // based  on the response comes from backend
        if (!this.hasPassword && !this.showForgotPasswordPopup) {
          this.shopMobilePopup = false;
          this.showConfiirmCodePopup = true;
          this.isMobileEntered = true;
          this.startTimer();
        }
        if (this.hasPassword && !response.data.forceLoginSms && !this.showForgotPasswordPopup) {
          this.shopMobilePopup = false;
          this.showLoginWithPasswordPopup = true;
          this.isMobileEntered = true;
        }
        if (this.hasPassword && response.data.forceLoginSms && !this.showForgotPasswordPopup) {
          this.shopMobilePopup = false;
          this.showConfiirmCodePopup = true;
          this.isMobileEntered = true;
          this.startTimer();
        }
      },
      error: (err) => {
        console.log('error in component', err);
        this.isLoading = false;
        this.checkMobileForm.get('mobile')?.enable();
        this.toastService.error(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  processVerificationCode() {
    this.isLoading = true;
    if (this.verificationCodeForm.invalid) {
      this.toastService.error(' کد تایید فرمت درستی ندارد');
      this.isLoading = false;
      return;
    }

    const requestData = {
      mobile: this.checkMobileForm.value.mobile,
      confirmCode: this.verificationCodeForm.get('verifyCode')?.value,
    };

    this.authService.confirmCode(requestData).subscribe({
      next: (response) => {
        console.log(response);
        this.toastService.success(response.message);
        this.showConfiirmCodePopup = false;
        console.log('in response to confirm code ', this.hasPassword);
        if (this.hasPassword) {
          this.router.navigateByUrl('/');
        } else {
          this.setPassword = true;
          // change to ras id 
          this.router.navigate(['/newprofile'], { queryParams: { resval: response.id , mob: this.checkMobileForm.value.mobile } });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.verificationCodeForm.get('verifyCode')?.enable();
        this.toastService.error(err.message || 'خطای ناشناخته');
      },
      complete: () => {
        this.isLoading = false;
      },
    });

  }


  resendVerifyCode() {
    this.isLoading = true;
    if (this.timer > 0) {
      return;
    }
    this.authHTTPService
      .resendConfirmCode({ mobile: this.checkMobileForm.get('mobile')?.value })
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.startTimer();
          this.toastService.success(data.message || 'کد تایید با موفقیت ارسال شد!');
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.error(err.message || 'خطای ناشناخته');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  // API Call for sending password
  LoginWithPassword() {
    console.log('a;shdf');

    this.isLoading = true;
    if (this.passwordForm.invalid) {
      this.toastService.error('فرم را به درستی پر کنید');
      this.isLoading = false;
      return;
    }
    const data = {
      mobile: this.checkMobileForm.value.mobile,
      password: this.passwordForm.value.password,
    };
    this.authService.loginPassword(data).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message || 'ورود موفق');
        this.router.navigateByUrl('/');
      },
      error: (err: any) => {
        this.toastService.error(err || 'خطای ناشناخته');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  isPasswordVisible = false;
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  get verifyCodeControl() {
    return this.verificationCodeForm.get('verifyCode');
  }

  OnSetPassword() {
    this.isLoading = true;
    if (this.setPasswordForm.invalid) {
      this.toastService.error('اطلاعات نا معتبر است');
      this.isLoading = false;
      return;
    }
    const data = {
      password: this.setPasswordForm.get('password')?.value,
      passwordC: this.setPasswordForm.get('passwordC')?.value,
    };
    console.log('on set password');
    this.authHTTPService.setPassword(data).subscribe({
      next: (data: any) => {
        this.toastService.success(data.message || 'ثبت شد!');
        this.router.navigateByUrl('/');
      },
      error: (err: any) => {
        this.toastService.error(err.message || 'خطای ناشناخته');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onResetPassword() {
    this.isLoading = true;
    if (this.forgotPasswordForm.invalid) {
      this.toastService.error('اطلاعات نا معتبر است');
      this.isLoading = false;
      return;
    }
    console.log(this.forgotPasswordForm.value);

    if (
      this.forgotPasswordForm.get('password')?.value !==
      this.forgotPasswordForm.get('password_confirmation')?.value
    ) {
      this.toastService.error('گذرواژه ی جدید با تایید گذرواژه برابر نیست!');
      this.isLoading = false;
      return;
    }

    this.authHTTPService.resetPassword(this.forgotPasswordForm.value).subscribe({
      next: (data: any) => {
        this.toastService.success(data.message || 'ثبت شد!');
        this.showForgotPasswordPopup = false;
        this.shopMobilePopup = true;
      },
      error: (err: any) => {
        this.toastService.error(err.message || 'خطای ناشناخته');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private createForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(9|09)(10|11|12|13|14|15|16|17|18|19|90|91|92|30|33|01|02|03|04|05|35|36|37|38|39|32|20|21|22)\d{7}$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()-_+=?<>]+$/),
        ],
      ],
      password_confirmation: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()-_+=?<>]+$/),
        ],
      ],
      mobile_verification_code: ['', [Validators.required, Validators.pattern(/^\d{4,8}$/)]],
    });
  }
  private createSetPasswordForm() {
    this.setPasswordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()-_+=?<>]+$/),
        ],
      ],
      passwordC: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()-_+=?<>]+$/),
        ],
      ],
    });
  }
  private createPasswordForm() {
    this.passwordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()-_+=?<>]+$/),
        ],
      ],
    });
  }
  private createLoginForm() {
    this.checkMobileForm = this.fb.group({
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(9|09)(10|11|12|13|14|15|16|17|18|19|90|91|92|30|33|01|02|03|04|05|35|36|37|38|39|32|20|21|22)\d{7}$/
          ),
        ],
      ],
    });
  }

  private createVerifyCodeForm() {
    this.verificationCodeForm = this.fb.group({
      verifyCode: ['', [Validators.required, Validators.pattern(/^\d{4,8}$/)]],
    });
  }
}
