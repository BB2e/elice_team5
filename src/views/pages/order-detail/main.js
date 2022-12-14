import orderService from '/public/scripts/orderService.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';

const createOrderRow = (orderId, { summaryTitle, totalPrice, status }) => {
  const orderRow = document.createElement('div');
  orderRow.className = 'row';
  orderRow.innerHTML = `
        <div class="order_number">
          <b>주문번호</b>
          <span class="order_number_detail">${orderId}</span>
        </div>
        <div>
          <b>주문 내역</b>
          <span class="order_summary">${summaryTitle}</span>
        </div>
        <div>
          <b>주문 상태</b>
          <span class="order_status">${status}</span>
        </div>
        <div>
          <b>금액</b>
          <span class="order_price">${totalPrice.toLocaleString('ko-kr')}</span>
        </div>
    `;
  return orderRow;
};

const createDeliveryInfo = ({
  address: {
    receiverName,
    receiverPhoneNumber,
    address1,
    address2,
    postalCode,
  },
  status,
}) => {
  const deliveryInfo = document.createElement('div');
  deliveryInfo.classname = 'delivery_info';
  deliveryInfo.innerHTML = `
            <em>배송 정보</em>
            <div class="row">
              <div class="line">
                <b>받는 사람</b>
                <span class="receiver_name">${receiverName}</span>
              </div>
              <div class="line">
                <b>주소</b>
                <span class="receiver_address"
                  >${postalCode + ' ' + address1 + ' ' + address2}</span
                >
              </div>
              <div class="line">
                <b>연락처</b>
                <span class="receiver_phone_number">${receiverPhoneNumber}</span>
              </div>
              <div class="line">
                <b>배송 상태</b>
                <span class="delivery_status">${status}</span>
              </div>`;
  return deliveryInfo;
};

const orderChangeEventHandler = (orderId) => (e) => {
  e.preventDefault();
  if (confirm('배송정보를 수정하시겠습니까?')) {
    location.href = `/order-change/${orderId}`;
  } else {
    return;
  }
};
const orderCancelEventHandler = (orderId) => async (e) => {
  e.preventDefault();
  if (confirm('주문을 취소하시겠습니까?')) {
    const response = await orderService.deleteOrderByOrderId(orderId);

    if (response.acknowledged) {
      alert('주문이 취소되었습니다.');
      location.href = '/pay-history';
    }
  } else {
    return;
  }
};

const init = async () => {
  loggedInOnlyPageProtector();
  const orderId = location.pathname.split('/')[2];

  const { order } = await orderService.getOrderByOrderId(orderId);
  const orderWrapper = document.querySelector('.order_wrapper');
  const deliveryDetail = document.querySelector('.delivery_detail');
  orderWrapper.appendChild(createOrderRow(orderId, order));
  deliveryDetail.appendChild(createDeliveryInfo(order));

  const orderChangeBtn = document.querySelector('.order_change_btn');
  const orderCancelBtn = document.querySelector('.order_cancel_btn');
  if (['배송 중', '배송 완료'].includes(order.status)) {
    orderChangeBtn.disabled = true;
    orderChangeBtn.style.display = 'none';
    orderChangeBtn.innerText = '배송을 취소할 수 없습니다.';
    orderCancelBtn.disabled = true;
    orderCancelBtn.style.display = 'none';
    orderCancelBtn.innerText = '배송을 취소할 수 없습니다.';
  } else {
    orderChangeBtn.addEventListener('click', orderChangeEventHandler(orderId));
    orderCancelBtn.addEventListener('click', orderCancelEventHandler(orderId));
  }
};

document.addEventListener('DOMContentLoaded', init);
