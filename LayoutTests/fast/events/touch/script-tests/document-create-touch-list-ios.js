description("This tests support for the document.createTouchList and window.TouchEvent APIs.");

// To use TouchEvents use createEvent and initTouchEvent.
shouldBeTrue("'TouchEvent' in window");
shouldBeFalse("window.propertyIsEnumerable('TouchEvent')");
shouldThrow('new TouchEvent()');

shouldBeTrue('"createTouchList" in document');

// Test createTouchList with no arguments.
var touchList = document.createTouchList();
shouldBeNonNull("touchList");
shouldBe("touchList.length", "0");
shouldBeNull("touchList.item(0)");
shouldBeNull("touchList.item(1)");

// Test createTouchList with Touch objects as arguments.
try {
    var t = document.createTouch(window, document.body, 12341, 60, 65, 100, 105);
    var t2 = document.createTouch(window, document.body, 12342, 50, 55, 115, 120);
    var tl = document.createTouchList(t, t2);

    var evt = document.createEvent("TouchEvent");
    evt.initTouchEvent("touchstart", false, false, window, 0, 0, 0, 0, 0, true, false, false, false, tl, tl, tl, 1, 0);

    document.body.addEventListener("touchstart", function handleTouchStart(ev) {
        ts = ev;
        shouldBe("ts.touches.length", "2");
        shouldBe("ts.touches[0].identifier", "12341");
        shouldBe("ts.touches[0].clientX", "60");
        shouldBe("ts.touches[1].screenY", "120");
        shouldBe("ts.ctrlKey", "true");
    });

    document.body.dispatchEvent(evt);
} catch(e) {
    testFailed("An exception was thrown: " + e.message);
}

// Test createTouchList with invalid arguments which throws exceptions.
shouldThrow("var tl = document.createTouchList(1, 2)");

successfullyParsed = true;
isSuccessfullyParsed();

