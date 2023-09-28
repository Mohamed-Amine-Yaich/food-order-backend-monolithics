export interface CreateFoodInput {
    name: string;
    discription: string;
    price: number;
    vandorId: string;
     readyTime: string;
     cathegory:string
     foodType: string;
     rating:number
     images:[string]

}



export interface  FoodUpdateInput {
    discription: string;
    price: number;
    vandorId: string;
    readyTime: string;
    cathegory:string
    foodType: string;
    rating:number
    images:[string]
}