export interface ConfirmCodeResponse{
    data:{
        token: string,
        user:{
            id:number,
            name: string,
            username:string,
            mobile:string,
            birthday:string,
            parent_id: null | number
        }

    },
    message:string,
    success:boolean,
}