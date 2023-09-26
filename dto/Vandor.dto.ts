export interface CreateVandorInput {
name : string,
ownerName : string,
foodType : [string],
pincode: string,
adress: string,
email: string,
password : string,
phone : string

}
export interface VandorLoginInput {
    email: string,
    password : string,


}

export interface VandorAuthPayload {
    name : string
    _id: string
    email : string

}

export interface  VandorUpdateInput {
    name : string ,foodType: [string],adress: string
}