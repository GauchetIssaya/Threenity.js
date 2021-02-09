// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The function below is executed in the context of the inspected page.
chrome.devtools.panels.create("Threenity",
    "MyPanelIcon.jpg",
    "Panel.html",
    function(panel) {
      // code invoked on panel creation
      console.log("panel created")
    }
);

/* chrome.devtools.inspectedWindow.eval(
  "jQuery.fn.jquery",
  function(result, isException) {
    if (isException) {
      console.log("the page is not using jQuery");
    } else {
      console.log("The page is using jQuery v" + result);
    }
  }
); */


chrome.devtools.inspectedWindow.getResources( (resource ) => {
  var url = resource;

  console.log(url)
  });