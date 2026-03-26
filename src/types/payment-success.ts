export type PaymentSuccessInfo = {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  helpText: string;
  helpLinkText: string;
  helpLinkHref: string;
};

export type TransactionDetailsData = {
  label: string;
  plan: string;
  amount: string;
  date: string;
  status: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type PaymentSuccessFooter = {
  brand: string;
  copyright: string;
  links: FooterLink[];
};