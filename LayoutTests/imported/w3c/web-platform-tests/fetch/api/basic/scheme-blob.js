if (this.document === undefined) {
  importScripts("/resources/testharness.js");
  importScripts("../resources/utils.js");
}

function checkFetchResponse(url, data, mime, size, desc) {
  promise_test(function(test) {
    size = size.toString();
    return fetch(url).then(function(resp) {
      assert_equals(resp.status, 200, "HTTP status is 200");
      assert_equals(resp.type, "basic", "response type is basic");
      assert_equals(resp.headers.get("Content-Type"), mime, "Content-Type is " + resp.headers.get("Content-Type"));
      assert_equals(resp.headers.get("Content-Length"), size, "Content-Length is " + resp.headers.get("Content-Length"));
      return resp.text();
    }).then(function(bodyAsText) {
      assert_equals(bodyAsText, data, "Response's body is " + data);
    });
  }, desc);
}

var blob = new Blob(["Blob's data"], { "type" : "text/plain" });
checkFetchResponse(URL.createObjectURL(blob), "Blob's data", "text/plain",  blob.size,
                  "Fetching [GET] URL.createObjectURL(blob) is OK");

function checkKoUrl(url, method, desc) {
  promise_test(function(test) {
    var promise = fetch(url, {"method": method});
    return promise_rejects(test, new TypeError(), promise);
  }, desc);
}

var blob2 = new Blob(["Blob's data"], { "type" : "text/plain" });
var blob2URL = URL.createObjectURL(blob2);
checkKoUrl(blob2URL + "notfoundblob", "GET",
          "Fetching [GET] not found blob URL is KO");

var invalidRequestMethods = [
  "POST",
  "OPTIONS",
  "HEAD",
  "PUT",
  "DELETE",
  "INVALID",
];
invalidRequestMethods.forEach(function(method) {
  checkKoUrl(blob2URL, method, "Fetching [" + method + "] URL.createObjectURL(blob) is KO");
});

done();
