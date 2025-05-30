export const getPaymentBackgroundColor = (paymentOption: string) => {
  switch (paymentOption) {
    case "financing":
      return "#f0f7ff";
    case "cash":
      return "#e8f5e9";
    case "bank":
      return "#f3e5f5";
    case "card":
      return "#e8eaf6";
    default:
      return "#f7f7f7";
  }
};

export const getPaymentBorderColor = (paymentOption: string) => {
  switch (paymentOption) {
    case "financing":
      return "#cce0ff";
    case "cash":
      return "#c8e6c9";
    case "bank":
      return "#e1bee7";
    case "card":
      return "#c5cae9";
    default:
      return "#e0e0e0";
  }
};
