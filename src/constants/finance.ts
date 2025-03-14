import { PaymentEnum } from "@/enums/finance.enum"

const BALANCE_RATE_VND_TO_USD = 26000
const BALANCE_RATE_VND_TO_USD_DOMAIN = 26000
const BALANCE_RATE_VND_TO_USD_DIGITAL_OCEAN = 25500

const PAYMENT_METHODS = [
  // {
  //   object_id: PaymentEnum.ACB,
  //   name: 'payment.acb',
  //   image: 'https://cdn.tgdd.vn/2020/04/GameApp/unnamed-200x200-18.png'
  // },
  // {
  //   object_id: PaymentEnum.VNPAY,
  //   name: 'payment.vnpay',
  //   image: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png'
  // },
  {
    object_id: PaymentEnum.DEFAULT_WALLET,
    name: 'payment.default_wallet',
    image:
      'https://kstatic.googleusercontent.com/files/8aa097770b082bdb126ddb0eb7e157369f0e8dfa9b3feca35a9e2cc3dc2a396df666d8ea5903bd485cf4d3c254d3aff621627b334e587f013d53382bf7e340ad'
  }
  // {
  //   object_id: PaymentEnum.PAYPAL,
  //   name: 'payment.paypal',
  //   image:
  //     'https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/optimize/Online_Primary_Acceptance_Mark_RGB_V2_small.jpg'
  // }
]

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export {
  BALANCE_RATE_VND_TO_USD,
  BALANCE_RATE_VND_TO_USD_DIGITAL_OCEAN,
  BALANCE_RATE_VND_TO_USD_DOMAIN,
  PAYMENT_METHODS
}
