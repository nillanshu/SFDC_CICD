public class CurrencyConverter {
    @future(callout=true)
    public static void convertCurrencyFuture(String fromCurrency, String toCurrency, String amount) {
        Decimal amountDecimal = Decimal.valueOf(amount);
        convertCurrency(fromCurrency, toCurrency, amountDecimal);
    }
    
    public static void convertCurrency(String fromCurrency, String toCurrency, Decimal amount) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://xecdapi.xe.com/v1/convert_from.json' + '?from=' + fromCurrency + '&to=' + toCurrency + '&amount=' + amount);
        req.setMethod('GET');
        req.setHeader('Authorization', 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf('aptcloudssoftwaresolutions651512366' + ':' + 'q6m4ouambms6l434kl10rrl3ef')));
        Http http = new Http();
        HttpResponse res = http.send(req);
        //System.debug(res.getBody());
        //return (Decimal)res.getBody();
        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
        System.debug(responseMap);
        
    }
}