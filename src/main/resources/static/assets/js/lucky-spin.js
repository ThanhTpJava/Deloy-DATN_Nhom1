
app.controller("luckyspin-ctrl", function($scope, $http, $q, $window, $timeout) {
	$scope.timeRotate = 7000;
	$scope.currentRotate = 0;
	$scope.isRotating = false;
	$scope.listGift = [];


	$scope.size = $scope.listGift.length;
	$scope.rotate = 360 / $scope.size;
	$scope.skewY = 90 - $scope.rotate;

	$scope.isPopupOpenVer2 = false;
	$scope.PopupTitle = ""
	$scope.PopupMessage = ""
	$scope.congratIcon = "/images/icons/congrat.png"
	$scope.iconUrlPopup = "/images/icons/tick.png"
	$scope.sadIcon = "/images/icons/sad.png"


	var deferred = $q.defer();
	$http.get(`/rest/luckySpin/getvoucher`).then(resp => {
		$scope.listGift = resp.data.map(item => {
			return {
				voucher_code: item.voucher_code,
				review: item.review,
				description: item.description,
				rate: item.rate / 100
			};
		});

		// Sắp xếp list voucher theo rate giảm dần
		$scope.listGift.sort(function(a, b) {
			return b.rate - a.rate;
		});

		// Xử lý dữ liệu khi thành công
		//console.log($scope.listGift);
		$scope.size = $scope.listGift.length;
		$scope.rotate = 360 / $scope.size;
		$scope.skewY = 90 - $scope.rotate;

		deferred.resolve();
	}).catch(error => {
		console.error('Error:', error);
		deferred.reject(error);
		// Xử lý lỗi ở đây
	});

	$scope.httpPromise = deferred.promise;

	$scope.startSpin = function() {
		// Logic của hàm
		$scope.isRotating = false;

		var randomNumber = Math.random();

		//console.log("randomNumber", randomNumber);

		$scope.giftResult = $scope.getGift(randomNumber);

		//console.log("giftResult", $scope.giftResult);

		$scope.currentRotate += 360 * ($scope.size + 2)

		//console.log("currentRotate", $scope.currentRotate);

		$scope.rotateWheel($scope.currentRotate, $scope.giftResult.index);

		$scope.showGift($scope.giftResult);
	};

	$scope.getGift = function(randomNumber) {
		let currentPercent = 0;
		let list = [];

		angular.forEach($scope.listGift, function(item, index) {
			// Cộng lần lượt phần trăm trúng của các phần thưởng
			currentPercent += item.rate;
			//console.log("currentPercent: ", currentPercent);

			// Số ngẫu nhiên nhỏ hơn hoặc bằng phần trăm hiện tại thì thêm phần thưởng vào danh sách
			if (randomNumber <= currentPercent) {
				//console.log("randomNumber", randomNumber);
				list.push({ ...item, index });
				//console.log(list);
			}
		});

		// Phần thưởng đầu tiên trong danh sách là phần thưởng quay được
		return list[0];
	};

	$scope.rotateWheel = function(currentRotate, index) {

		var rotate = $scope.rotate;
		// Tính toán giá trị transform
		var transformValue = 'rotate(' + (currentRotate - index * rotate - rotate / 2) + 'deg)';
		// Áp dụng giá trị transform vào DOM
		angular.element(document.querySelector('.wheel-class')).css('transform', transformValue);

		// hoặc sử dụng ID: angular.element('#wheel-id').css('transform', transformValue);

	};

	$scope.showGift = function(gift) {
		if (gift.voucher_code == 0) {
			$scope.PopupTitle = "Thiếu chút nữa thôi!"
			$scope.PopupMessage = gift.description;
			$scope.iconUrlPopup = $scope.sadIcon
			
		} else {
			$scope.PopupTitle = "Chúc mừng!!!"
			$scope.PopupMessage = "Bạn nhận được voucher " + gift.description;
			$scope.iconUrlPopup = $scope.congratIcon
			
		}

		$timeout(function() {
			$scope.isPopupOpenVer2 = true;
			//console.log(gift);
		}, 7000);
	}

	$scope.navigateToNewURL = function() {
		// Chuyển hướng đến URL mới
		$window.location.href = 'http://localhost:8080/auth/login/form';
	};

	$scope.closePopupVer2 = function() {
		$scope.isPopupOpenVer2 = false;
	}

})


app.directive('luckyWheel', function() {
	return {
		scope: {
			listGift: '=' // Truyền danh sách phần thưởng từ Controller
		},
		link: function(scope, element, attrs) {
			// Sử dụng $scope.$watch để theo dõi thay đổi của listGift
			scope.$watch('listGift', function(newListGift, oldListGift) {
				if (newListGift) {
					console.log("list gift: ", newListGift)
					element.empty();
					scope.size = newListGift.length;
					// Mảng màu cho các phần tử text
					var colors = ["#FF9933", "#66B2FF", "#3DE543", "#9F8CB6", "#95A5B6"];


					// Các logic tạo các phần tử li và thiết lập transform
					for (var index = 0; index < newListGift.length; index++) {
						var rotate = 360 / scope.size;
						var skewY = 90 - rotate;

						// Tạo phần tử li
						var elm = angular.element('<li></li>');

						elm.css('transform', 'rotate(' + rotate * index + 'deg) skewY(-' + skewY + 'deg)');
						var backgroundColor = colors[index % colors.length];
						// Thêm background-color và căn giữa cho các phần tử text
						elm.html('<p style="transform: skewY(' + skewY + 'deg) rotate(' + rotate / 2 + 'deg); background-color: ' + backgroundColor + ';" class="text"><b>' + newListGift[index].review + '</b></p>');

						// Thêm vào ul
						element.append(elm);

					}
				}
			});
		}
	};
});
