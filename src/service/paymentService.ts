import { IPayment } from "../interface/Payment"
import apiClient from "./apiClient"

export const createPaymentIntent = async (body:IPayment) => {
    const response = await apiClient.post(`/payment/create-intent`, body, 
    )
    return response.data.data.intent;
}