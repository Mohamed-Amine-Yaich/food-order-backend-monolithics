export const GenerateRandomOrderId=()=>{
    const length=10
    const characters = '0123456789';
    let orderId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      orderId += characters.charAt(randomIndex);
    }
  
    return orderId;
  }
  