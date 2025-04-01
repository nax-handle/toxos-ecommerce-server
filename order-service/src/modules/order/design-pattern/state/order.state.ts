// import { OrderContext } from "./context.state";
// import { OrderState } from "./state.interface";

// export class PendingState implements OrderState {
//   async confirm(context: OrderContext): Promise<void> {
//     console.log('Order confirmed.');
//     context.setState(new ShippedState());
//   }

//   async ship(): Promise<void> {
//     console.log('Cannot ship an order that is still pending.');
//   }

//   async deliver(): Promise<void> {
//     console.log('Cannot deliver an order that is still pending.');
//   }

//   async cancel(context: OrderContext): Promise<void> {
//     console.log('Order has been canceled.');
//   }

//   async refund(): Promise<void> {
//     console.log('Cannot refund a pending order.');
//   }

//   async review(): Promise<void> {
//     console.log('Cannot review a pending order.');
//   }

//   async canReview(): Promise<boolean> {
//     return false;
//   }

//   async getStateName(): Promise<string> {
//     return 'Pending';
//   }
// }
