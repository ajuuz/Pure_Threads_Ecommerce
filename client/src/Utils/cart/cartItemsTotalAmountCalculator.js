
export const totalAmountCalculator=(items,selectedCoupon)=>{
    let totalAmount=items.reduce((acc,curr)=>acc+=(curr?.product?.salesPrice*curr?.quantity),0)
    let couponDiscount = 0;
    if(selectedCoupon)
    {
        if(selectedCoupon?.couponType==="%") couponDiscount = totalAmount*selectedCoupon?.couponValue/100;
        else couponDiscount = selectedCoupon?.couponValue
    }
    return totalAmount-couponDiscount;
}