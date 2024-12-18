export interface IPayment {
    amount: number;
    currency: string;
    metadata: {
        token: string | null;
        type: string;
    }
}