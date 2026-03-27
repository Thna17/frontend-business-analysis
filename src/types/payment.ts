export type PaymentInfo = {
  title: string;
  subtitle: string;
  qrImage: string;
  status: string;
  methods: string[];
};

export type OrderSummary = {
  title: string;
  planName: string;
  description: string;
  price: string;
  tax: string;
  total: string;
  totalLabel: string;
  buttonText: string;
  note: string;
  securityText: string;
};