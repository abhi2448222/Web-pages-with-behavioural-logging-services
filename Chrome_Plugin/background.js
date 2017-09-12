chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.monitor === "selection made") {
			chrome.cookies.get({ url: 'http://localhost:1338/', name: 'userName' },
				function (cookie) {
					if (cookie) {
						console.log(cookie.value);
						var loadBehaviouralData= cookie.value + ";" + request.userBehaviouralData;
						var behavObj = {
							behaviouralLog: loadBehaviouralData
						};

						$.ajax({
							url: "http://localhost:1338/handleBehaviouralData",
							dataType: "json",
							success: function (result) {
								console.log("SUCCESS" + result);
							},
							data: behavObj,
							type: "POST"
						});

					}
					else {
						console.log('Not a registered user accessing stack overflow');
					}
				});
		}
	}
);