function SpreeProduct(options) {
  this.$variants = options.$variants;
  this.$productPrice = options.$productPrice;
  this.$markAsFavorite = options.$markAsFavorite;
}

SpreeProduct.prototype.initialize = function() {
  this.bindEvents();

  // if product has variants
  if(this.$variants.length != 1){
    this.$variants.prop('checked', false);
    this.$productPrice.hide();
  }

   var params = getQueryParams(document.location.search);
   if (params['favorite_product_id']) {
     $('#variant_id_' + params['favorite_product_id']).click();
     if(this.$variants.length == 1){
       this.markProductFavorite();
     }
   }
}

SpreeProduct.prototype.bindEvents = function() {
  this.$variants.on('click', this.changeFavoriteOption());
}

SpreeProduct.prototype.changeFavoriteOption = function() {
  var _this = this;

  return function() {
    _this.$productPrice.show();

    $.ajax({
      url: '/favorite_products/' + $(this).val() + '/change_favorite_option',
      method: 'GET',
      dataType: 'script',
      data: { type: 'Spree::Variant' },

      success: function(xhr, status) {},

      error: function(e) {},

      complete: function() {
        var params = getQueryParams(document.location.search);
        if (params['favorite_product_id']) {
          _this.markProductFavorite();
        }
      }
    })
  }
}

SpreeProduct.prototype.markProductFavorite = function() {
  if(this.$markAsFavorite) {
    this.$markAsFavorite.attr('data-remote', true);
    this.$markAsFavorite.trigger('click');
    window.history.replaceState(null, null, window.location.pathname); // remove query param
  }
}

$(function() {
  var options = {
    $variants: $('input[name="variant_id"]'),
    $productPrice: $('[data-hook="product_price"]'),
    $markAsFavorite: $('#mark-as-favorite')
  },
  spreeProduct = new SpreeProduct(options);
  spreeProduct.initialize();
})