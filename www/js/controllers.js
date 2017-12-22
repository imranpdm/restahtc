angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $http) {
  // $scope.playlists = [
  //   { title: 'Reggae', id: 1 },
  //   { title: 'Chill', id: 2 },
  //   { title: 'Dubstep', id: 3 },
  //   { title: 'Indie', id: 4 },
  //   { title: 'Rap', id: 5 },
  //   { title: 'Cowbell', id: 6 }
  // ];
  $http.get("http://localhost:8000/api/books").success(function(data){
    console.log(data);
    $scope.imr = data;
    
  })

  $scope.viewCart = function() {
    $state.go("app.cart")
    // $location.path(appConst.path.cart_list);
    // $rootScope.cartListBack_button = true;
}

})

.controller('cartListCtrl', function($scope, $location, $timeout, $state, $http, $localStorage, $rootScope, $ionicHistory, findItemIndex, $ionicModal) {
  $scope.cost = {
      totalCost: 0
  };
  $scope.noItemsInCart = "";
  $scope.cartListItems = [];
  $rootScope.orderDetails = [];


  $scope.getCartList = function() {
      angular.element(document).ready(function() {
          // $scope.handleEditDoneIcons('edit', 'done');
          $scope.editOrderVal = true;
          $scope.noItemsInCart = "";
          if ($localStorage.cart_list.length > 0) {
              $scope.cartListItems = [];
              angular.forEach($localStorage.cart_list, function(value, key) {
                  var extraData = {
                      "finalCost": value.costAfterSize,
                      "quantity": 1
                  };
                  angular.extend(value, extraData);
                  $scope.cartListItems.push(value);
              });
              $scope.calculateTotalCost($scope.cartListItems);
              console.log($scope.cartListItems);
          } else {
              $scope.noItemsInCart = $translate.instant("noItemsInYourCart");
          }
      });
  }
//   $scope.removeItem = function(array, id) {
//       findItemIndex.findItemIndexInAddons(array, '', id).then(function(index) {
//           if (index != -1) {
//               array.splice(index, 1);
//               $scope.removeItem(array, id);
//           }
//       });
//   }
 
  $scope.calculateTotalCost = function(item) {
      $scope.cost.totalCost = 0;
      angular.forEach(item, function(value, key) {
          $scope.cost.totalCost = parseInt(value.item_cost) + parseInt($scope.cost.totalCost);
      });
      
  }

  $ionicModal.fromTemplateUrl('templates/srcdestinationmodal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/orederview.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.omodal = modal;
  });

  $scope.opensourcemodal = function(){
    $scope.modal.show();
    
  }

  $scope.openovmodal = function(){
    alert("df");
    $scope.omodal.show();
    
  }
  $scope.saveAndContinue = function(u) {
      $scope.itemss = [];
      var a = [];
      angular.forEach($scope.cartListItems, function(value, key) {
          var itemDetails = {
              item_name: value.item_name,
              item_cost: value.item_cost
          }
          $rootScope.orderDetails.push(itemDetails);
      });
      console.log($rootScope.orderDetails.length);
      $rootScope.totalCost = $scope.cost.totalCost;
      console.log($scope.cost.totalCost);

      for (var i=0; i<$rootScope.orderDetails.length; i++) {
        a.push($rootScope.orderDetails[i]['item_name']);
        
      }
      console.log(a);
      var itemn = a.join();
      console.log(itemn);
      
      var data = $.param({
        items: itemn,
        total_cost: $scope.cost.totalCost,
        source: u.source,
        destination: u.destination,
    
    });
    // console.log(json.st)
    console.log(JSON.stringify(data));
    

    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    $scope.imr = function(a, b, c, d, e){
      console.log(b);
      $location.path('/app/orderview/').search({order_id: a, items: b, total_cost: c, source: d, destination: e,});
      
    }

    $http.post('http://localhost:8000/api/order', data, config)
    .success(function (data, status, headers, config) {
        console.log(data.items);
        // $.ordview = data;
        
        if(data.items === itemn)
        {
          // alert("yes");
          $scope.modal.hide();
          // $state.go("app.orderview");
          $timeout(function () {
          $scope.imr(data.order_id,data.items,data.total_cost,data.source,data.destination);            
         }, 400);
        }
        else{
          alert("no");
        }
        // $scope.PostDataResponse = data;
    })
    .error(function (data, status, header, config) {
        $scope.ResponseDetails = "Data: " + data +
            "<hr />status: " + status +
            "<hr />headers: " + header +
            "<hr />config: " + config;
    });
  }

  $scope.viewCart = function() {
    alert("dfd");
    $state.go("app.cart")
    
}
})


.controller('ordViewCtrl', function($scope, $stateParams, $state, $http, $location, $localStorage, $ionicPopup, $rootScope, $ionicModal) {
     $scope.order_id = $stateParams.order_id;
     $scope.items = $stateParams.items;
     $scope.total_cost = $stateParams.total_cost;
     $scope.source = $stateParams.source;
     $scope.destination = $stateParams.destination;
})

.controller('PlaylistCtrl', function($scope, $stateParams, $state, $http, $location, $localStorage, $ionicPopup, $rootScope, $ionicModal, findItemIndex) {
  var id = $stateParams.playlistId;
  $scope.itemname = $stateParams.itemname;
  console.log(id);
  $http.get("http://localhost:8000/api/books/"+id).success(function(data){
    console.log(data);
    $scope.selected_item = data;
  })

  // $localStorage.cart_list = [];
  if(!$localStorage.cart_list){
    $localStorage.cart_list = [];
}

  $scope.addToCart = function(item) {
    if (findItemIndex.findItemIndexInCartList($localStorage.cart_list, '', item.item_id) == -1) {
        $localStorage.cart_list.push(item);
        $rootScope.cartCount = $localStorage.cart_list.length;
        // $scope.handleCartListIcon('cart_list_icon2');
        // window.plugins.toast.show($translate.instant("itemAddedToCart"), 'short', 'bottom');
        alert("added");
    } else {
        // window.plugins.toast.show($translate.instant("alreadyAddedToCart"), 'short', 'bottom');
        alert("alreadyAddedToCart");
    }
}

$scope.viewCart = function() {
  $state.go("app.cart");
}
});


