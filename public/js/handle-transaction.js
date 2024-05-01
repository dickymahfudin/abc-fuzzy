const inputDate = $('input[name="transactionDate"]');
const tagProduct = $('#products');

let transactionDate;
let loading = false;
let filter = {
  totalPage: 0,
  currentPage: 1,
  search: '',
};
let dataProducts = [];
let productCart = [];
const configTrans = [
  { priceType: 'buyPrice', priceCart: false, amountCart: false },
  { priceType: 'currentPrice', priceCart: true, amountCart: true },
][type === 'Pembelian' ? 0 : 1];

inputDate.on('cancel.daterangepicker', function (ev, picker) {
  $(this).val('');
});

const debounce = (callback, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback(...args);
    }, delay);
  };
};

const fetchProduct = query => {
  loading = true;
  tagProduct.append(`
      <div class="spinner-border my-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `);
  const columns = [
    { data: 'sku', searchable: 'true' },
    { data: 'name', searchable: 'true' },
  ];
  const length = 10;
  const start = length * (query?.currentPage - 1 || 0);

  $.ajax({
    type: 'GET',
    url: '/product/table',
    data: {
      start,
      length,
      columns,
      search: { value: query?.search ?? '', regex: 'false' },
    },
    dataType: 'json',
    success: function (res) {
      loading = false;
      let data = res?.data || [];
      data = data.map(e => ({ ...e, baseStock: e.stock }));
      dataProducts = [...dataProducts, ...data];
      filter = { ...filter, ...query, totalPage: res?.totalPage ?? 0 };
      handleStock();
    },
  });
};

const refetch = debounce(fetchProduct, 500);

const rupiah = number => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

const handleAddProduct = id => {
  const findByid = dataProducts.find(e => e.id == id);
  const findCart = productCart.find(e => e.id == id);
  if (!findCart) productCart.push({ ...findByid, amount: 1 });
  else findCart.amount = findCart.amount + 1;
  handleStock();
};

const handleRemoveProduct = id => {
  const findProduct = dataProducts.find(e => e.id == id);
  if (findProduct) {
    productCart = productCart.filter(e => e.id != id);
    findProduct.stock = findProduct.baseStock;
    handleStock();
  }
};

const renderProductList = datas => {
  tagProduct.empty();

  let products = datas.map(product => {
    const currentPrice = rupiah(product.currentPrice);
    const buyPrice = rupiah(product.buyPrice);
    const stock = product?.stock ?? 0;
    return `
            <div class="col-md-12">
                <div class="card text-dark bg-info mb-3 p-2">
                    <div class="row">
                        <div class="col-8">
                            <div>${product?.name}</div>
                            <div>Harga Beli: ${buyPrice}</div>
                            <div>Harga Jual: ${currentPrice}</div>
                            <div>Stock: ${stock}</div>
                        </div>
                        <div class="col-4 d-flex justify-content-end">
                            <button type="button" onclick="handleAddProduct('${product.id}')" class="btn btn-primary">
                                <i class="bx bx-right-arrow"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
  });

  if (!datas?.length) {
    products = `<h5>Data Produk Tidak ditemukkan</h5>`;
  }

  tagProduct.append(products);
};

const renderProductCart = () => {
  $('#productCart').empty();
  $('#total').text('');
  let total = 0;
  const cart = productCart.map(cart => {
    const price = cart.amount * cart[configTrans.priceType];
    total += price;

    return `
            <div>
                <div class="mt-2">${cart.name}</div>
                ${configTrans.priceCart ? `<div class="mt-1">${rupiah(price)}</div>` : ''}
                <div class="row mt-1">
                  <div class="col-9">
                    <div class="input-group mb-3">
                      <span class="input-group-text" id="basic-addon1">Qty</span>
                      <input type="number" class="form-control" min="1" id="amount-input-${cart.id}" value="${cart.amount}"
                        onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'"/>
                    </div>
                  </div>
                  <div class="col-3">
                    <button type="button" class="btn btn-danger" onclick="handleRemoveProduct('${cart.id}')"><i class="bx bx-trash"></i></button>
                  </div>
                </div>
            </div>`;
  });
  $('#productCart').append(cart);
  $('#total').text(`Total Harga ${rupiah(total)}`);

  productCart.forEach((cartItem, i, array) => {
    const input = $(`#amount-input-${cartItem.id}`);
    input.attr('max', cart.baseStock);
    input.on('input', function () {
      let value = $(this).val() || 1;
      let cart = array[i];

      if (+value > cartItem.baseStock && configTrans.amountCart) {
        value = cartItem.baseStock;
        $(this).val(value);
        alert('Jumlah melebihi stok yang tersedia!');
      }
      cart['amount'] = +value;
      $(this).on('mouseup', function () {
        return handleStock();
      });

      const debounceStock = debounce(handleStock, 1500);
      return debounceStock();
    });
  });
};

const handleStock = () => {
  if (configTrans.amountCart && dataProducts.length) {
    productCart.forEach(cart => {
      const findProduct = dataProducts.find(e => e.id == cart.id);
      if (findProduct) {
        let stock = findProduct.baseStock - cart.amount;
        if (stock < 0) {
          stock = 0;
          cart.amount = findProduct.baseStock;
        }
        findProduct.stock = stock;
      }
    });
  }

  renderProductList(dataProducts);
  renderProductCart();
};

$('#submitTransaction').click(function (e) {
  e.preventDefault();
  let error;
  if (!transactionDate) error = 'Tanggal Produksi Harus diisi';
  else if (productCart.length < 1) error = 'Daftar Produk Harus diPilih';
  if (error) notification('error', error);
  else {
    $(this).prop('disabled', true);
    const formDetail = value?.detail || [];
    const detail = productCart.map(cart => {
      const findDetail = formDetail.find(e => e?.product?.id == cart.id);
      let res = {};
      if (findDetail) res = { ...res, id: findDetail.id };
      return {
        ...res,
        amount: cart.amount,
        productId: cart.id,
        [configTrans.priceType]: cart[[configTrans.priceType]],
      };
    });
    const payload = {
      id: value?.id || undefined,
      transactionDate,
      detail,
    };

    $.ajax({
      type: 'post',
      url: action,
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function (res) {
        $('#submitTransaction').prop('disabled', false);
        if (res.success) {
          notification('success', res.message);
          setTimeout(function () {
            window.location.href = `${window.location.origin}/${redirect}`;
          }, 2000);
        } else {
          notification('error', res.message);
        }
      },
    });
  }
});

$('#search').on('input', function () {
  const keyword = $(this).val().trim();
  dataProducts = [];
  tagProduct.empty();
  refetch({ ...filter, currentPage: 1, search: keyword });
});

//handle loadmore
tagProduct.scroll(function () {
  if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 10) {
    if (filter?.totalPage !== filter?.currentPage && !loading)
      refetch({ ...filter, currentPage: (filter.currentPage += 1) });
  }
});

if (value?.id) {
  const date = moment(value.transactionDate).format('DD-MM-YYYY HH:mm');
  const detail = value.detail.map(e => ({
    id: e.product.id,
    amount: e.amount,
    name: e.product.name,
    [configTrans.priceType]: e.product[configTrans.priceType],
  }));

  inputDate.val(date);
  transactionDate = date;
  productCart = detail;
  renderProductCart();
} else {
  const currentDate = moment().format('DD-MM-YYYY HH:mm');
  inputDate.val(currentDate);
  transactionDate = currentDate;
}

fetchProduct();

$(document).ready(function () {
  inputDate.daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: true,
      timePicker: true,
      autoUpdateInput: false,
      locale: {
        cancelLabel: 'Clear',
        format: 'DD-MM-YYYY HH:mm',
      },
    },
    function (start, end, label) {
      transactionDate = moment(start).format('DD-MM-YYYY HH:mm');
      inputDate.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD-MM-YYYY HH:mm'));
      });
    },
  );
});
