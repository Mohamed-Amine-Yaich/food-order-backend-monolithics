export interface CreateFoodInput {
    name: string;
    discription: string;
    price: number;
    vandorId: string;
     readyTime: string;
     cathegory:string
     foodType: string;
     rating:number
     images:[Express.Multer.File]

}



export interface  FoodUpdateInput {
    discription: string;
    price: number;
    vandorId: string;
    readyTime: string;
    cathegory:string
    foodType: string;
    rating:number
    images:[Express.Multer.File]
}