const roomTpl = require('../components/room/room.pug');
const roomsList = [
  {
    name: 'Эконом',
    img: './images/rooms/room-еconomy.jpg',
    imgAlt: 'Номер Эконом',
    area: 0.63,
    equipment: {
      empty: true,
      bed: false,
      scratchingPost: false,
      gameComplex: false,
      house: false,
    },
    price: 100,
  },
  {
    name: 'Эконом плюс',
    img: './images/rooms/room-economy-plus.jpg',
    imgAlt: 'Эконом плюс',
    area: 0.90,
    size: '90х100х180',
    equipment: {
      empty: false,
      bed: true,
      scratchingPost: true,
      gameComplex: false,
      house: false,
    },
    price: 200,
  },
  {
    name: 'Комфорт',
    img: './images/rooms/room-comfort.jpg',
    imgAlt: 'Номер Комфорт',
    area: 1.13,
    size: '100х125х180',
    equipment: {
      empty: false,
      bed: true,
      scratchingPost: true,
      gameComplex: true,
      house: false,
    },
    price: 250,
  },
  {
    name: 'Номер Сьют',
    img: './images/rooms/room-suite.jpg',
    imgAlt: 'Сьют',
    area: 1.56,
    size: '125х125х180',
    equipment: {
      empty: false,
      bed: true,
      scratchingPost: true,
      gameComplex: true,
      house: false,
    },
    price: 350,
  },
  {
    name: 'Номер Люкс',
    img: './images/rooms/room-luxe.jpg',
    imgAlt: 'Люкс',
    area: 2.56,
    size: '160х160х180',
    equipment: {
      empty: false,
      bed: true,
      scratchingPost: true,
      gameComplex: true,
      house: true,
    },
    price: 500,
  },
  {
    name: 'Номер Супер-Люкс',
    img: './images/rooms/room-super-luxe.jpg',
    imgAlt: 'Супер-Люкс',
    area: 2.88,
    size: '180х160х180',
    equipment: {
      empty: false,
      bed: true,
      scratchingPost: true,
      gameComplex: true,
      house: true,
    },
    price: 600,
  },
];

let sortParam = '2';
let areaFilter = [0.63, 0.90, 1.13, 1.56, 2.56, 2.88];
let equipmentFilter = ['empty', 'bed', 'scratchingPost', 'gameComplex', 'house'];
let priceFromFilter = '';
let priceToFilter = '';

window.onload = function() {
  const sort = function(value, list) {
    let sortedRoomsList = list.slice();
    if (value === '1') {
      sortedRoomsList.sort(function(a, b) {
        return b.area - a.area;
      });
    }

    if (value === '2') {
      sortedRoomsList.sort(function(a, b) {
        return a.area - b.area;
      });
    }

    if (value === '3') {
      sortedRoomsList.sort(function(a, b) {
        return b.price - a.price;
      });
    }

    if (value === '4') {
      sortedRoomsList.sort(function(a, b) {
        return a.price - b.price;
      });
    }

    return sortedRoomsList;
  };

  const filter = function(list, areaValue, equipmentValue, priceFromValue, priceToValue) {
    let filteredList = list.filter(function(item) {
      return areaValue.includes(item.area);
    });

    filteredList = filteredList.filter(function(item) {
      let isValid = false;
      equipmentValue.forEach(function(option) {
        if (item.equipment[option]) {
          isValid = true;
        }
      });
      return isValid;
    });

    if (priceFromValue) {
      filteredList = filteredList.filter(function(item) {
        return item.price >= Number(priceFromValue);
      });
    }

    if (priceToValue) {
      filteredList = filteredList.filter(function(item) {
        return item.price <= Number(priceToValue);
      });
    }

    return filteredList;
  }

  const render = function(arr) {
    let results = arr.reduce(function(previousValue, item) {
      return previousValue + roomTpl(item);
    }, '');

    document.getElementById('js_rooms').innerHTML = results;
  };

  render(roomsList);

  const sortMenuEl = document.getElementById('js_sort');
  sortMenuEl.addEventListener('click', function(event) {
    this.classList.toggle('sort--active');
  });
  sortMenuEl.addEventListener('focusout', function(event) {
    this.classList.remove('sort--active');
  });

  document.getElementById('js_sort_list').addEventListener('click', function(event) {
    const sortSelectedEl = document.getElementById('js_sort_selected');
    sortSelectedEl.innerHTML = event.target.getAttribute('data-text');
    if (event.target.getAttribute('data-value') === '1' || event.target.getAttribute('data-value') === '3') {
      sortSelectedEl.classList.remove('sort__icon--down');
      sortSelectedEl.classList.add('sort__icon--up');
    } else {
      sortSelectedEl.classList.remove('sort__icon--up');
      sortSelectedEl.classList.add('sort__icon--down');
    }

    sortParam = event.target.getAttribute('data-value');

    let filteredList = filter(roomsList, areaFilter, equipmentFilter, priceFromFilter, priceToFilter);
    let sortedRoomsList = sort(sortParam, filteredList);

    render(sortedRoomsList);
  });

  document.getElementById('js_filter_btn_apply').addEventListener('click', function(event) {
    let checkboxListArea = document.querySelectorAll('.js_filter_item_area');
    let checkboxListEquipment = document.querySelectorAll('.js_filter_item_equipment');
    areaFilter = [];
    equipmentFilter = [];
    priceFromFilter = document.getElementById('js_filter_item_price_from').value;
    priceToFilter = document.getElementById('js_filter_item_price_to').value;
    
    checkboxListArea.forEach(function(item) {
      if (item.checked) {
        areaFilter.push(Number(item.value));
      }
    });

    checkboxListEquipment.forEach(function(item) {
      if (item.checked) {
        equipmentFilter.push(item.value);
      } 
    });

    let filteredList = filter(roomsList, areaFilter, equipmentFilter, priceFromFilter, priceToFilter);
    let sortedRoomsList = sort(sortParam, filteredList);

    document.getElementById('js_filter').classList.remove('filter--active');

    render(sortedRoomsList);
  });

  document.getElementById('js_mobile_menu').addEventListener('click', function(event) {
    event.currentTarget.classList.toggle('mobile-menu--active');
    document.body.classList.toggle('document-body--no-scroll');
  });

  document.getElementById('js_mobile_filter').addEventListener('click', function(event) {
    document.getElementById('js_filter').classList.add('filter--active');
  });

  document.getElementById('js_filter_closebtn').addEventListener('click', function(event) {
    document.getElementById('js_filter').classList.remove('filter--active');
  });

  document.querySelectorAll('input').forEach(function(elem) {
    elem.addEventListener('change', function(event) {
      document.getElementById('js_filter_btn_reset').classList.add('filter__btn--active');
    });
  });

  document.getElementById('js_filter_btn_reset').addEventListener('click', function(event) {
    document.querySelectorAll('.js_filter_item_area').forEach(function(elem) {
      elem.checked = true;
    });
    document.querySelectorAll('.js_filter_item_equipment').forEach(function(elem) {
      elem.checked = true;
    });
    document.getElementById('js_filter_item_price_from').value = '';
    document.getElementById('js_filter_item_price_to').value = '';

    document.getElementById('js_filter').classList.remove('filter--active');

    render(roomsList);
  });
};