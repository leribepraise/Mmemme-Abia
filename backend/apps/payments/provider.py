import json
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
from django.conf import settings
from apps.common.api import ServiceUnavailable

class Paystack:
    def request(self,path,payload=None,*,envelope=False):
        if not settings.PAYSTACK_SECRET_KEY:
            raise ServiceUnavailable("Payment processing has not been configured.")
        req = Request("https://api.paystack.co"+path,data=json.dumps(payload).encode() if payload is not None else None,headers={"Authorization":"Bearer "+settings.PAYSTACK_SECRET_KEY,"Content-Type":"application/json"},method="POST" if payload is not None else "GET")
        try:
            with urlopen(req,timeout=15) as response:
                result = json.loads(response.read(2*1024*1024))
            if not isinstance(result,dict) or result.get("status") is not True or "data" not in result:
                raise ValueError()
            return result if envelope else result["data"]
        except (HTTPError,URLError,TimeoutError,ValueError,OSError):
            # Do not disclose provider bodies, credentials, or customer payment data.
            raise ServiceUnavailable("The payment provider could not confirm this request. Check its status before retrying.")

    def initialize(self,payment):
        return self.request("/transaction/initialize",{"reference":payment.reference,"amount":int(payment.amount*100),"currency":payment.currency,"email":payment.user.email,"callback_url":settings.PAYSTACK_CALLBACK_URL,"metadata":{"booking_id":str(payment.booking_id)}})
    def verify(self,reference):
        return self.request("/transaction/verify/"+quote(reference,safe=""))
    def refund(self,refund):
        return self.request("/refund",{"transaction":refund.payment.reference,"amount":int(refund.amount*100),"currency":refund.payment.currency,"merchant_note":"Mmemme refund "+str(refund.pk)})
    def get_refund(self,provider_id):
        return self.request("/refund/"+quote(str(provider_id),safe=""))
    def list_refunds(self,transaction_id):
        return self.request("/refund?transaction="+quote(str(transaction_id),safe=""))

    def banks(self):
        banks, cursor = [], None
        for _ in range(20):
            query = {"country":"nigeria","currency":"NGN","type":"nuban","perPage":100,"use_cursor":"true"}
            if cursor: query["next"] = cursor
            result = self.request("/bank?"+urlencode(query), envelope=True)
            if not isinstance(result.get("data"),list): raise ServiceUnavailable("Invalid bank list.")
            banks.extend({"code":str(row["code"]),"name":row["name"]} for row in result["data"] if row.get("active") and not row.get("is_deleted"))
            cursor = (result.get("meta") or {}).get("next")
            if not cursor: return banks
        raise ServiceUnavailable("The bank list could not be loaded completely.")

    def resolve_account(self,number,bank):
        return self.request("/bank/resolve?"+urlencode({"account_number":number,"bank_code":bank}))

    def create_recipient(self,number,bank,name):
        return self.request("/transferrecipient",{"type":"nuban","name":name,"account_number":number,"bank_code":bank,"currency":"NGN"})

    def transfer(self,payout,attempt):
        return self.request("/transfer",{"source":"balance","amount":int(payout.amount*100),"currency":payout.currency,"recipient":payout.account.recipient_code,"reference":attempt.reference,"reason":"Mmemme Abia provider earnings"})

    def verify_transfer(self,reference):
        return self.request("/transfer/verify/"+quote(reference,safe=""))

    def finalize_transfer(self,code,otp):
        return self.request("/transfer/finalize_transfer",{"transfer_code":code,"otp":otp})
