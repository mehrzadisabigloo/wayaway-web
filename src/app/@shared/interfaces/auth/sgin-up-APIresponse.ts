export interface SignUpAPIResponse{
    success: boolean;
    message: string;
    data : {
        birthday: string,
        id:number,
        mobile:string,
        name:string,
        parent_id: number | null,
        username: string,
    };
}