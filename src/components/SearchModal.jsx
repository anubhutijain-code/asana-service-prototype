import { useState, useEffect, useRef } from 'react';
import { TICKETS, HR_TICKETS, PEOPLE, HR_PEOPLE, KNOWLEDGE_ARTICLES, WORK_TASKS } from '../data/tickets';

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M11.78 10.7195L9.87651 8.8165C10.6045 7.86408 10.999 6.69875 10.9995 5.5C10.9995 2.4675 8.53201 0 5.49951 0C2.46701 0 -0.000488281 2.4675 -0.000488281 5.5C-0.000488281 8.5325 2.46701 11 5.49951 11C6.74601 11 7.89301 10.5785 8.81601 9.877L10.719 11.78C10.8655 11.9265 11.0575 11.9995 11.2495 11.9995C11.4415 11.9995 11.6335 11.9265 11.78 11.78C11.9265 11.6335 11.9995 11.4415 11.9995 11.2495C11.9995 11.0575 11.9265 10.866 11.78 10.7195ZM5.49851 9.5C3.29351 9.5 1.49851 7.7055 1.49851 5.5C1.49851 3.2945 3.29301 1.5 5.49851 1.5C7.70401 1.5 9.49851 3.2945 9.49851 5.5C9.49851 7.7055 7.70401 9.5 5.49851 9.5Z" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M8.5 3.5L5 7L1.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg width="12" height="12" viewBox="30 14 16 16" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M37.9995 14.0035C33.5885 14.0035 29.9995 17.5575 29.9995 21.9685C29.9995 26.3795 33.5885 29.9685 37.9995 29.9685C42.4105 29.9685 45.9995 26.3795 45.9995 21.9685C45.9995 17.5575 42.4105 14.0035 37.9995 14.0035ZM37.9995 28.9685C34.1395 28.9685 30.9995 25.8285 30.9995 21.9685C30.9995 18.1085 34.1395 14.9685 37.9995 14.9685C41.8595 14.9685 44.9995 18.1085 44.9995 21.9685C44.9995 25.8285 41.8595 28.9685 37.9995 28.9685ZM41.35 19.7235C41.4444 19.8165 41.498 19.9431 41.4992 20.0755C41.5003 20.208 41.4488 20.3355 41.356 20.43L36.7525 25.106C36.7059 25.1533 36.6504 25.1908 36.5892 25.2164C36.528 25.2421 36.4624 25.2552 36.396 25.2552C36.3297 25.2552 36.264 25.2421 36.2028 25.2164C36.1416 25.1908 36.0861 25.1533 36.0395 25.106L34.143 23.179C34.097 23.1322 34.0606 23.0768 34.036 23.0159C34.0114 22.9551 33.999 22.8899 33.9996 22.8243C34.0001 22.7586 34.0136 22.6937 34.0393 22.6333C34.0649 22.5729 34.1022 22.5181 34.149 22.472C34.1958 22.426 34.2513 22.3897 34.3121 22.365C34.373 22.3404 34.4381 22.3281 34.5038 22.3286C34.5694 22.3292 34.6343 22.3427 34.6947 22.3683C34.7552 22.3939 34.81 22.4312 34.856 22.478L36.396 24.043L40.643 19.729C40.736 19.6345 40.8627 19.5808 40.9953 19.5796C41.1279 19.5785 41.2555 19.6306 41.35 19.7235Z" />
    </svg>
  );
}

function StrategyIcon() {
  return (
    <svg width="12" height="12" viewBox="30 74 16 15" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M39.767 75.7085C39.5759 75.414 39.314 75.1719 39.0054 75.0045C38.6968 74.8371 38.3511 74.7496 38 74.75C37.285 74.75 36.6245 75.108 36.2335 75.708L30.35 84.7215C30.1378 85.0405 30.0173 85.4117 30.0015 85.7945C29.9858 86.1773 30.0753 86.5571 30.2605 86.8925C30.4389 87.2293 30.7063 87.5106 31.0336 87.7059C31.3608 87.9012 31.7354 88.0029 32.1165 88H43.883C44.2641 88.0029 44.6387 87.9012 44.9659 87.7059C45.2932 87.5106 45.5606 87.2293 45.739 86.8925C45.9243 86.5571 46.0139 86.1773 45.9981 85.7945C45.9823 85.4116 45.8617 85.0405 45.6495 84.7215L39.767 75.708V75.7085ZM44.86 86.417C44.7662 86.5944 44.6254 86.7426 44.4532 86.8455C44.2809 86.9484 44.0837 87.002 43.883 87.0005H32.1165C31.9159 87.002 31.7187 86.9484 31.5465 86.8455C31.3743 86.7426 31.2337 86.5944 31.14 86.417C31.0422 86.2396 30.9949 86.0388 31.0032 85.8364C31.0115 85.6341 31.0751 85.4378 31.187 85.269L37.071 76.255C37.1704 76.0991 37.3078 75.971 37.4703 75.8827C37.6328 75.7945 37.8151 75.749 38 75.7505C38.3815 75.7505 38.72 75.9345 38.93 76.2555L44.8135 85.269C45.042 85.6195 45.0585 86.0485 44.86 86.417Z" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg width="12" height="12" viewBox="30 134 16 16" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M41.5 140H43.5C44.327 140 45 139.327 45 138.5V136.5C45 135.673 44.327 135 43.5 135H41.5C40.673 135 40 135.673 40 136.5V137H36.202C35.966 135.722 34.845 134.75 33.5 134.75C32.7709 134.751 32.072 135.041 31.5565 135.556C31.041 136.072 30.7509 136.771 30.75 137.5C30.75 138.845 31.722 139.966 33 140.202V144H32.5C31.673 144 31 144.673 31 145.5V147.5C31 148.327 31.673 149 32.5 149H34.5C35.327 149 36 148.327 36 147.5V147H43.293L41.6465 148.646C41.5527 148.74 41.5001 148.867 41.5001 149C41.5001 149.133 41.5527 149.26 41.6465 149.354C41.7403 149.447 41.8674 149.5 42 149.5C42.1326 149.5 42.2597 149.447 42.3535 149.354L44.8535 146.854C44.9 146.807 44.9368 146.752 44.962 146.691C44.9872 146.631 45.0001 146.566 45.0001 146.5C45.0001 146.434 44.9872 146.369 44.962 146.309C44.9368 146.248 44.9 146.193 44.8535 146.146L42.3535 143.646C42.2597 143.553 42.1326 143.5 42 143.5C41.8674 143.5 41.7403 143.553 41.6465 143.646C41.5527 143.74 41.5001 143.867 41.5001 144C41.5001 144.133 41.5527 144.26 41.6465 144.354L43.293 146H36V145.5C36 144.673 35.327 144 34.5 144H34V140.202C34.5463 140.1 35.049 139.835 35.442 139.442C35.835 139.049 36.1 138.546 36.202 138H40V138.5C40 139.327 40.673 140 41.5 140Z" />
    </svg>
  );
}

function PeopleGroupIcon() {
  return (
    <svg width="12" height="12" viewBox="30 194 16 16" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M40.5 202.98C42.7055 202.98 44.5 201.185 44.5 198.98C44.5 196.774 42.7055 194.98 40.5 194.98C38.2945 194.98 36.5 196.774 36.5 198.98C36.5 201.185 38.2945 202.98 40.5 202.98ZM40.5 195.98C42.1545 195.98 43.5 197.325 43.5 198.98C43.5 200.634 42.1545 201.98 40.5 201.98C38.8455 201.98 37.5 200.634 37.5 198.98C37.5 197.325 38.8455 195.98 40.5 195.98ZM46 207.515V208.48C46 208.613 45.9473 208.74 45.8536 208.834C45.7598 208.927 45.6326 208.98 45.5 208.98C45.3674 208.98 45.2402 208.927 45.1464 208.834C45.0527 208.74 45 208.613 45 208.48V207.515C44.9991 206.843 44.7316 206.199 44.2563 205.723C43.781 205.248 43.1366 204.981 42.4645 204.98H38.536C37.8639 204.981 37.2195 205.248 36.7442 205.723C36.2689 206.199 36.0014 206.843 36.0005 207.515V208.48C36.0005 208.613 35.9478 208.74 35.8541 208.834C35.7603 208.927 35.6331 208.98 35.5005 208.98C35.3679 208.98 35.2407 208.927 35.1469 208.834C35.0532 208.74 35.0005 208.613 35.0005 208.48V207.515C35.0017 206.578 35.3746 205.679 36.0374 205.016C36.7002 204.354 37.5987 203.981 38.536 203.98H42.4645C43.4018 203.981 44.3003 204.354 44.9631 205.016C45.6259 205.679 45.9988 206.578 46 207.515ZM32.5 198.98C32.5 200.634 33.8455 201.98 35.5 201.98C35.6326 201.98 35.7598 202.033 35.8536 202.126C35.9473 202.22 36 202.347 36 202.48C36 202.613 35.9473 202.74 35.8536 202.834C35.7598 202.927 35.6326 202.98 35.5 202.98C33.2945 202.98 31.5 201.185 31.5 198.98C31.5 196.774 33.2945 194.98 35.5 194.98C35.6326 194.98 35.7598 195.033 35.8536 195.126C35.9473 195.22 36 195.347 36 195.48C36 195.613 35.9473 195.74 35.8536 195.834C35.7598 195.927 35.6326 195.98 35.5 195.98C33.8455 195.98 32.5 197.325 32.5 198.98ZM30 207.515C30.0013 206.578 30.3743 205.679 31.037 205.017C31.6998 204.354 32.5983 203.981 33.5355 203.98H34.5C34.6326 203.98 34.7598 204.033 34.8536 204.126C34.9473 204.22 35 204.347 35 204.48C35 204.613 34.9473 204.74 34.8536 204.834C34.7598 204.927 34.6326 204.98 34.5 204.98H33.5355C32.8634 204.981 32.219 205.248 31.7437 205.723C31.2684 206.199 31.0009 206.843 31 207.515V208.48C31 208.613 30.9473 208.74 30.8536 208.834C30.7598 208.927 30.6326 208.98 30.5 208.98C30.3674 208.98 30.2402 208.927 30.1464 208.834C30.0527 208.74 30 208.613 30 208.48V207.515Z" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg width="12" height="12" viewBox="35 254 16 17" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M48.999 255H36.999C35.896 255 34.999 255.897 34.999 257V264C34.999 265.103 35.896 266 36.999 266H42.499V269H38.499C38.3664 269 38.2392 269.053 38.1455 269.146C38.0517 269.24 37.999 269.367 37.999 269.5C37.999 269.633 38.0517 269.76 38.1455 269.854C38.2392 269.947 38.3664 270 38.499 270H47.499C47.6316 270 47.7588 269.947 47.8526 269.854C47.9463 269.76 47.999 269.633 47.999 269.5C47.999 269.367 47.9463 269.24 47.8526 269.146C47.7588 269.053 47.6316 269 47.499 269H43.499V266H48.999C50.102 266 50.999 265.103 50.999 264V257C50.999 255.897 50.102 255 48.999 255ZM49.999 264C49.999 264.552 49.5505 265 48.999 265H36.999C36.4475 265 35.999 264.552 35.999 264V257C35.999 256.448 36.4475 256 36.999 256H48.999C49.5505 256 49.999 256.448 49.999 257V264Z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M0.999512 10C0.999512 11.103 1.89651 12 2.99951 12H8.99951C10.1025 12 10.9995 11.103 10.9995 10V3C10.9995 1.897 10.1025 1 8.99951 1H7.99951C7.99951 0.4485 7.55051 0 6.99951 0H4.99951C4.44801 0 3.99951 0.4485 3.99951 1H2.99951C1.89651 1 0.999512 1.897 0.999512 3V10ZM4.99951 1H6.99951V2H4.99951V1ZM1.99951 3C1.99951 2.4485 2.44801 2 2.99951 2H3.99951C3.99951 2.5515 4.44801 3 4.99951 3H6.99951C7.55051 3 7.99951 2.5515 7.99951 2H8.99951C9.55101 2 9.99951 2.4485 9.99951 3V10C9.99951 10.5515 9.55101 11 8.99951 11H2.99951C2.44801 11 1.99951 10.5515 1.99951 10V3Z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M6 7C7.9295 7 9.5 5.43 9.5 3.5C9.5 1.57 7.9295 0 6 0C4.0705 0 2.5 1.57 2.5 3.5C2.5 5.43 4.0705 7 6 7ZM6 1C7.3785 1 8.5 2.121 8.5 3.5C8.5 4.878 7.3785 6 6 6C4.6215 6 3.5 4.878 3.5 3.5C3.5 2.121 4.6215 1 6 1ZM3.5 8H8.5C9.8785 8 11 9.121 11 10.5V11.5C11 11.6326 10.9473 11.7598 10.8536 11.8536C10.7598 11.9473 10.6326 12 10.5 12C10.3674 12 10.2402 11.9473 10.1464 11.8536C10.0527 11.7598 10 11.6326 10 11.5V10.5C10 9.6725 9.327 9 8.5 9H3.5C2.673 9 2 9.6725 2 10.5V11.5C2 11.6326 1.94732 11.7598 1.85355 11.8536C1.75979 11.9473 1.63261 12 1.5 12C1.36739 12 1.24021 11.9473 1.14645 11.8536C1.05268 11.7598 1 11.6326 1 11.5V10.5C1 9.121 2.1215 8 3.5 8Z" />
    </svg>
  );
}

function PortfoliosIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10.5 3H6.3045C6.21951 3.00026 6.13586 2.97882 6.06148 2.93769C5.98711 2.89656 5.92446 2.83712 5.8795 2.765L4.9245 1.235C4.87951 1.16302 4.81693 1.10367 4.74267 1.06256C4.6684 1.02144 4.58489 0.999915 4.5 1H0.5C0.367392 1 0.240215 1.05268 0.146447 1.14645C0.0526784 1.24022 0 1.36739 0 1.5V9.5C0 10.327 0.673 11 1.5 11H10.5C11.327 11 12 10.327 12 9.5V4.5C12 3.673 11.327 3 10.5 3Z" />
    </svg>
  );
}

function TicketStubIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M7.99875 5.59478C8.03538 5.62917 8.06472 5.67058 8.08504 5.71654C8.10535 5.7625 8.11622 5.81207 8.117 5.86232C8.11778 5.91256 8.10845 5.96244 8.08958 6.00901C8.0707 6.05558 8.04266 6.09788 8.00712 6.1334C7.97157 6.16892 7.92925 6.19693 7.88267 6.21577C7.83609 6.23462 7.7862 6.24391 7.73596 6.24309C7.68571 6.24227 7.63615 6.23137 7.5902 6.21102C7.54426 6.19068 7.50287 6.1613 7.4685 6.12465L7.18725 5.8434C7.12172 5.7722 7.08625 5.67843 7.08825 5.58168C7.09026 5.48493 7.12958 5.39271 7.19801 5.32428C7.26643 5.25586 7.35866 5.21653 7.4554 5.21453C7.55215 5.21252 7.64593 5.24799 7.71713 5.31353L7.99875 5.59478ZM6.40575 4.00178C6.33455 3.93624 6.24077 3.90077 6.14403 3.90278C6.04728 3.90478 5.95506 3.94411 5.88663 4.01253C5.81821 4.08096 5.77888 4.17318 5.77688 4.26993C5.77487 4.36668 5.81034 4.46045 5.87588 4.53165L6.15713 4.8129C6.19187 4.84785 6.23318 4.87558 6.27868 4.8945C6.32418 4.91342 6.37297 4.92316 6.42225 4.92316C6.47153 4.92316 6.52032 4.91342 6.56582 4.8945C6.61132 4.87558 6.65263 4.84785 6.68738 4.8129C6.75756 4.74259 6.79698 4.64731 6.79698 4.54796C6.79698 4.44862 6.75756 4.35333 6.68738 4.28303L6.40575 4.00178ZM11.7773 5.3349L5.33475 11.7774C5.18925 11.9237 4.99688 11.9964 4.80525 11.9964C4.70683 11.9966 4.60935 11.9773 4.51841 11.902C4.42747 11.902 4.34488 11.8467 4.27538 11.777L3.35288 10.8545C3.30015 10.8018 3.26432 10.7346 3.24996 10.6615C3.2356 10.5884 3.24336 10.5126 3.27225 10.4439C3.37428 10.2039 3.40216 9.9389 3.3523 9.68294C3.30245 9.42698 3.17714 9.1918 2.9925 9.00765C2.80844 8.82276 2.57318 8.69728 2.3171 8.64742C2.06102 8.59755 1.79587 8.62559 1.55588 8.7279C1.48722 8.75676 1.41153 8.7645 1.33846 8.75014C1.26538 8.73578 1.19825 8.69997 1.14563 8.64728L0.223126 7.72478C0.082637 7.58415 0.00372314 7.3935 0.00372314 7.19471C0.00372314 6.99593 0.082637 6.80528 0.223126 6.66465L6.66563 0.223276C6.80619 0.0828106 6.99678 0.00390625 7.1955 0.00390625C7.39422 0.00390625 7.58481 0.0828106 7.72538 0.223276L8.64788 1.14578C8.7006 1.19846 8.73643 1.26566 8.75079 1.3388C8.76515 1.41194 8.75739 1.48769 8.7285 1.5564C8.62639 1.79643 8.59847 2.06153 8.64832 2.31756C8.69818 2.5736 8.82354 2.80885 9.00825 2.99303C9.19238 3.17769 9.42759 3.30299 9.68357 3.35278C9.93955 3.40257 10.2046 3.37458 10.4445 3.2724C10.5132 3.24331 10.589 3.23544 10.6622 3.24981C10.7353 3.26418 10.8026 3.30013 10.8551 3.35303L11.7776 4.27553C11.9181 4.41616 11.997 4.60681 11.997 4.80559C11.997 5.00437 11.9181 5.19502 11.7776 5.33565L11.7773 5.3349ZM11.2474 4.80503L10.491 4.04865C10.1391 4.14852 9.76689 4.1524 9.41298 4.05988C9.05908 3.96737 8.73638 3.78183 8.47838 3.52253C8.21914 3.26439 8.03366 2.94163 7.94115 2.58768C7.84864 2.23374 7.85247 1.86149 7.95225 1.50953L7.19625 0.753151L5.17688 2.77253L5.51625 3.1119C5.58222 3.18771 5.60254 3.23367 5.6345 3.37944C5.63528 3.42968 5.62595 3.47957 5.60708 3.52614C5.5882 3.5727 5.56016 3.615 5.52462 3.65052C5.48907 3.68604 5.44675 3.71405 5.40017 3.7329C5.35359 3.75174 5.3037 3.76103 5.25346 3.76021C5.20321 3.7594 5.15365 3.74849 5.1077 3.72815C5.06176 3.7078 5.02037 3.67843 4.986 3.64178L4.64663 3.3024L0.753376 7.19528L1.50975 7.95165C1.86165 7.85178 2.23386 7.84791 2.58777 7.94042C2.94167 8.03294 3.26437 8.21847 3.52238 8.47778C3.78161 8.73591 3.96709 9.05867 4.0596 9.41262C4.15211 9.76657 4.14828 10.1388 4.0485 10.4908L4.8045 11.2472L8.69775 7.35428L8.35838 7.0149C8.29284 6.9437 8.25737 6.84993 8.25938 6.75318C8.26138 6.65643 8.30071 6.56421 8.36913 6.49578C8.43756 6.42736 8.52978 6.38803 8.62653 6.38603C8.72328 6.38402 8.81705 6.41949 8.88825 6.48503L9.22763 6.8244L11.2466 4.8054L11.2474 4.80503Z" />
    </svg>
  );
}

function RoadmapIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="1" y="1.5" width="7" height="1.75" rx="0.875" />
      <rect x="1" y="5.125" width="10" height="1.75" rx="0.875" />
      <rect x="1" y="8.75" width="4" height="1.75" rx="0.875" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10.2892 1.7198C10.2196 1.65012 10.1369 1.59484 10.046 1.55713C9.95497 1.51941 9.85745 1.5 9.75896 1.5C9.66047 1.5 9.56294 1.51941 9.47196 1.55713C9.38098 1.59484 9.29832 1.65012 9.22871 1.7198L6.00921 4.9398L2.78921 1.7198C2.71951 1.6502 2.63678 1.59501 2.54576 1.55738C2.45473 1.51975 2.35718 1.50041 2.25868 1.50048C2.16018 1.50055 2.06266 1.52002 1.97168 1.55778C1.88071 1.59554 1.79806 1.65085 1.72846 1.72055C1.65886 1.79025 1.60367 1.87297 1.56604 1.964C1.52841 2.05503 1.50908 2.15258 1.50914 2.25108C1.50921 2.34958 1.52868 2.4471 1.56644 2.53807C1.6042 2.62905 1.65951 2.7117 1.72921 2.7813L4.94821 6.0013L1.72871 9.2208C1.65711 9.29002 1.60001 9.3728 1.56075 9.46432C1.52149 9.55584 1.50084 9.65427 1.50003 9.75385C1.49921 9.85344 1.51823 9.95219 1.55598 10.0443C1.59374 10.1365 1.64947 10.2202 1.71992 10.2906C1.79037 10.361 1.87414 10.4166 1.96633 10.4543C2.05852 10.492 2.15728 10.5109 2.25687 10.51C2.35645 10.5091 2.45486 10.4883 2.54634 10.449C2.63783 10.4096 2.72056 10.3525 2.78971 10.2808L6.00921 7.0613L9.22871 10.2813C9.37521 10.4278 9.56721 10.5008 9.75871 10.5008C9.90695 10.5007 10.0518 10.4566 10.175 10.3742C10.2983 10.2918 10.3943 10.1747 10.451 10.0377C10.5077 9.90076 10.5226 9.75006 10.4937 9.60466C10.4648 9.45926 10.3935 9.32568 10.2887 9.2208L7.07021 6.0008L10.2897 2.7808C10.43 2.64004 10.5087 2.44934 10.5085 2.25059C10.5084 2.05184 10.4293 1.86129 10.2887 1.7208L10.2892 1.7198Z" />
    </svg>
  );
}

// ─── Pill icon resolver ────────────────────────────────────────────────────────

function PillIcon({ type }) {
  switch (type) {
    case 'work':        return <WorkIcon />;
    case 'plan':        return <StrategyIcon />;
    case 'workflow':    return <WorkflowIcon />;
    case 'company':     return <PeopleGroupIcon />;
    case 'service':     return <ServiceIcon />;
    case 'tasks':       return <WorkIcon />;
    case 'projects':    return <ClipboardIcon />;
    case 'people':      return <PersonIcon />;
    case 'portfolios':  return <PortfoliosIcon />;
    case 'goals':       return <StrategyIcon />;
    case 'tickets':     return <TicketStubIcon />;
    case 'knowledge':   return <ClipboardIcon />;
    case 'roadmaps':    return <RoadmapIcon />;
    case 'rules':       return <ClipboardIcon />;
    case 'templates':   return <ClipboardIcon />;
    case 'automations': return <WorkflowIcon />;
    case 'members':     return <PersonIcon />;
    case 'teams':       return <PeopleGroupIcon />;
    case 'departments': return <PortfoliosIcon />;
    default: return null;
  }
}

// ─── Context config ───────────────────────────────────────────────────────────

const CONTEXT_CONFIG = {
  work: {
    type: 'work',
    label: 'Work',
    subPills: [
      { type: 'tasks',      label: 'Tasks' },
      { type: 'projects',   label: 'Projects' },
      { type: 'portfolios', label: 'Portfolios' },
    ],
  },
  plan: {
    type: 'plan',
    label: 'Strategy',
    subPills: [
      { type: 'goals',      label: 'Goals' },
      { type: 'portfolios', label: 'Portfolios' },
      { type: 'roadmaps',   label: 'Roadmaps' },
    ],
  },
  workflow: {
    type: 'workflow',
    label: 'Workflow',
    subPills: [
      { type: 'rules',       label: 'Rules' },
      { type: 'templates',   label: 'Templates' },
      { type: 'automations', label: 'Automations' },
    ],
  },
  company: {
    type: 'company',
    label: 'People',
    subPills: [
      { type: 'members',     label: 'Members' },
      { type: 'teams',       label: 'Teams' },
      { type: 'departments', label: 'Departments' },
    ],
  },
  service: {
    type: 'service',
    label: 'Service',
    subPills: [
      { type: 'tickets',   label: 'Tickets' },
      { type: 'knowledge', label: 'Knowledge Base' },
      { type: 'projects',  label: 'Projects' },
    ],
  },
};

// Entity pills shown when no mode is scoped
const ENTITY_PILLS = [
  { type: 'tasks',     label: 'Tasks' },
  { type: 'projects',  label: 'Projects' },
  { type: 'people',    label: 'People' },
  { type: 'goals',     label: 'Goals' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function HighlightMatch({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ fontWeight: 600 }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

function Avatar({ person }) {
  if (!person) return null;
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      background: `#${person.bg}`, color: `#${person.fg}`,
      fontSize: 9, fontWeight: 600, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {person.initials}
    </div>
  );
}

function dedupeByName(people) {
  const seen = new Set();
  return people.filter(p => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}

// ─── Sub-filter pill ──────────────────────────────────────────────────────────

function FilterPill({ type, label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0"
      style={active
        ? { background: '#EEF2FB', color: '#3F6AC4', border: '1px solid #3F6AC4' }
        : { background: 'transparent', color: '#1E1F21', border: '1px solid #D1D5DB' }
      }
    >
      <span style={{ color: active ? '#3F6AC4' : '#6D6E6F', display: 'flex', alignItems: 'center' }}>
        <PillIcon type={type} />
      </span>
      {label}
      {active && (
        <span style={{ color: '#3F6AC4', display: 'flex', alignItems: 'center', marginLeft: 2 }}>
          <XIcon />
        </span>
      )}
    </button>
  );
}

// ─── Mode scope selector (single pill + fixed-position dropdown) ─────────────

function ModeScopePill({ activeContext, open, onOpenDropdown, onSelectMode, onClear }) {
  const cfg = activeContext ? CONTEXT_CONFIG[activeContext] : null;
  const btnRef = useRef(null);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, left: r.left });
    }
    onOpenDropdown();
  }

  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
        style={{ background: '#EEF2FB', color: '#3F6AC4', border: '1px solid #3F6AC4' }}
      >
        {cfg ? (
          <>
            <span style={{ color: '#3F6AC4', display: 'flex', alignItems: 'center' }}>
              <PillIcon type={cfg.type} />
            </span>
            {cfg.label}
            <span
              role="button"
              onClick={e => { e.stopPropagation(); onClear(); }}
              style={{ color: '#3F6AC4', display: 'flex', alignItems: 'center', marginLeft: 2 }}
            >
              <XIcon />
            </span>
          </>
        ) : (
          <>
            Global
            <ChevronDownIcon />
          </>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            zIndex: 400,
            background: '#fff',
            borderRadius: 10,
            minWidth: 180,
            paddingBlock: 6,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Global option */}
          <button
            type="button"
            onClick={onClear}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', padding: '10px 16px',
              fontSize: 14, fontWeight: !activeContext ? 500 : 400,
              color: !activeContext ? '#3F6AC4' : '#1E1F21',
              background: !activeContext ? '#EEF2FB' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => { if (activeContext) e.currentTarget.style.background = '#F7F8F9'; }}
            onMouseLeave={e => { if (activeContext) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{
              color: !activeContext ? '#3F6AC4' : '#9ea0a2',
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}>
              <SearchIcon size={12} />
            </span>
            Global
          </button>
          <div style={{ height: 1, background: '#EDEAE9', margin: '2px 0' }} />
          {Object.values(CONTEXT_CONFIG).map(({ type, label }) => {
            const isActive = activeContext === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onSelectMode(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '10px 16px',
                  fontSize: 14, fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#3F6AC4' : '#1E1F21',
                  background: isActive ? '#EEF2FB' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F7F8F9'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{
                  color: isActive ? '#3F6AC4' : '#9ea0a2',
                  display: 'flex', alignItems: 'center', flexShrink: 0,
                }}>
                  <PillIcon type={type} />
                </span>
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Row components ───────────────────────────────────────────────────────────

function RecentRow({ item, onSelect }) {
  const label = item.category ?? '';
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#f5f5f4] text-left"
    >
      {item._type === 'person' ? (
        <Avatar person={item.person} />
      ) : (
        <span style={{ color: '#AFABAC', flexShrink: 0 }}>
          {item._type === 'ticket' ? <TicketStubIcon /> : <ClipboardIcon />}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[#1d1f21] truncate">{item.name}</div>
        {label && <div className="text-xs text-[#9ea0a2]">{label}</div>}
      </div>
    </button>
  );
}

function TicketResultRow({ ticket, query, onClick }) {
  const isHR = ticket.id.startsWith('HR-');
  const person = isHR ? ticket.employee : ticket.requester;
  const label = (isHR ? ticket.issueType : ticket.category) ?? '';
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#f5f5f4] text-left"
    >
      <span style={{ color: '#3F6AC4', flexShrink: 0 }}><TicketStubIcon /></span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[#1d1f21] truncate">
          <HighlightMatch text={ticket.name} query={query} />
        </div>
        <div className="text-xs text-[#9ea0a2]">{label} · {ticket.id}</div>
      </div>
      <Avatar person={person} />
    </button>
  );
}

function TaskResultRow({ task, query }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#f5f5f4]">
      <span style={{ color: '#6D6E6F', flexShrink: 0 }}><ClipboardIcon /></span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[#1d1f21] truncate">
          <HighlightMatch text={task.name} query={query} />
        </div>
        <div className="text-xs text-[#9ea0a2]">{task.project} · {task.id}</div>
      </div>
      <span style={{ fontSize: 11, color: '#9ea0a2', flexShrink: 0 }}>{task.due}</span>
    </div>
  );
}

function KBResultRow({ article, query }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#f5f5f4]">
      <span style={{ color: '#3F6AC4', flexShrink: 0 }}><ClipboardIcon /></span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[#1d1f21] truncate">
          <HighlightMatch text={article.title} query={query} />
        </div>
        <div className="text-xs text-[#9ea0a2]">Article · {article.id}</div>
      </div>
    </div>
  );
}

function PersonResultRow({ person, query }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#f5f5f4]">
      <Avatar person={person} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[#1d1f21] truncate">
          <HighlightMatch text={person.name} query={query} />
        </div>
      </div>
    </div>
  );
}

function ResultSection({ title, items, renderItem }) {
  return (
    <div>
      <div className="px-4 pt-3 pb-1 text-xs font-semibold text-[#6D6E6F]">
        {title}
      </div>
      {items.map((item, i) => <div key={item.id ?? item.name ?? i}>{renderItem(item)}</div>)}
      {items.length >= 3 && (
        <button type="button" className="flex items-center gap-1 px-4 py-1.5 text-xs text-[#3F6AC4] hover:bg-[#f5f5f4] w-full">
          Show more →
        </button>
      )}
    </div>
  );
}

// ─── Contextual recents ───────────────────────────────────────────────────────

function getContextualRecents(contextMode) {
  switch (contextMode) {
    case 'service':
      return [
        ...TICKETS.slice(0, 4).map(t => ({ id: t.id, name: t.name, category: t.category, _type: 'ticket' })),
        ...HR_TICKETS.slice(0, 2).map(t => ({ id: t.id, name: t.name, category: t.issueType, _type: 'ticket' })),
      ];
    case 'work':
      return TICKETS.slice(0, 5).map(t => ({ id: t.id, name: t.name, category: t.category, _type: 'ticket' }));
    case 'company': {
      const people = dedupeByName([...Object.values(PEOPLE), ...Object.values(HR_PEOPLE)]).slice(0, 5);
      return people.map(p => ({ id: p.name, name: p.name, category: p.role ?? p.department ?? 'Team member', _type: 'person', person: p }));
    }
    case 'plan':
      return KNOWLEDGE_ARTICLES.slice(0, 4).map(a => ({ id: a.id, name: a.title, category: a.category, _type: 'article' }));
    case 'workflow':
      return [
        { id: 'wf-1', name: 'Auto-assign IT tickets to help desk', category: 'Rule', _type: 'rule' },
        { id: 'wf-2', name: 'Escalate tickets open > 3 days', category: 'Rule', _type: 'rule' },
        { id: 'wf-3', name: 'New employee onboarding flow', category: 'Automation', _type: 'rule' },
        { id: 'wf-4', name: 'Send welcome email on hire date', category: 'Automation', _type: 'rule' },
      ];
    default:
      return [
        ...TICKETS.slice(0, 2).map(t => ({ id: t.id, name: t.name, category: t.category, _type: 'ticket' })),
        ...HR_TICKETS.slice(0, 1).map(t => ({ id: t.id, name: t.name, category: t.issueType, _type: 'ticket' })),
        ...KNOWLEDGE_ARTICLES.slice(0, 1).map(a => ({ id: a.id, name: a.title, category: a.category, _type: 'article' })),
        ...dedupeByName([...Object.values(PEOPLE)]).slice(0, 1).map(p => ({ id: p.name, name: p.name, category: 'Team member', _type: 'person', person: p })),
      ];
  }
}

// ─── SearchModal ──────────────────────────────────────────────────────────────

export default function SearchModal({ onClose, contextMode, onSelectITTicket, onSelectHRTicket, pillRect }) {
  const [query, setQuery] = useState('');
  const [activeContext, setActiveContext] = useState(null); // no pre-selection
  const [subFilter, setSubFilter] = useState(null);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    }
    const id = setTimeout(() => document.addEventListener('mousedown', handleOutside), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handleOutside); };
  }, [onClose]);

  // Close scope dropdown on any click inside the modal (but outside the pill)
  useEffect(() => {
    if (!scopeOpen) return;
    function handleClick() { setScopeOpen(false); }
    const id = setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', handleClick); };
  }, [scopeOpen]);

  const q = query.trim().toLowerCase();
  const ctxConfig = activeContext ? CONTEXT_CONFIG[activeContext] : null;
  const isGlobal = !activeContext;

  // ── Results ─────────────────────────────────────────────────────────────────

  const isServiceCtx = activeContext === 'service';
  const showTickets   = isServiceCtx && (!subFilter || subFilter === 'tickets');
  const showKnowledge = isServiceCtx && (!subFilter || subFilter === 'knowledge');

  const ticketResults = q && showTickets
    ? [...TICKETS, ...HR_TICKETS].filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.category ?? t.issueType ?? '').toLowerCase().includes(q) ||
        (t.requester?.name ?? t.employee?.name ?? '').toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const kbResults = q && showKnowledge
    ? KNOWLEDGE_ARTICLES.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const uniquePeople = dedupeByName([...Object.values(PEOPLE), ...Object.values(HR_PEOPLE)]);
  const showPeople =
    (activeContext === 'company' && (!subFilter || subFilter === 'members')) ||
    (!activeContext && subFilter === 'people');
  const peopleResults = q && showPeople
    ? uniquePeople.filter(p => p.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  // Global search — runs across everything when no context is scoped
  const globalTicketResults = q && isGlobal
    ? [...TICKETS, ...HR_TICKETS].filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.category ?? t.issueType ?? '').toLowerCase().includes(q) ||
        (t.requester?.name ?? t.employee?.name ?? '').toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const globalKBResults = q && isGlobal
    ? KNOWLEDGE_ARTICLES.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const globalPeopleResults = q && isGlobal
    ? uniquePeople.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.role ?? '').toLowerCase().includes(q) ||
        (p.department ?? '').toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const globalTaskResults = q && isGlobal
    ? WORK_TASKS.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.project.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasResults = ticketResults.length > 0 || kbResults.length > 0 || peopleResults.length > 0 ||
    globalTicketResults.length > 0 || globalKBResults.length > 0 || globalPeopleResults.length > 0 || globalTaskResults.length > 0;
  const recents = getContextualRecents(contextMode);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleRecentSelect(item) {
    if (item._type === 'ticket') {
      const isHR = item.id?.startsWith('HR-');
      if (isHR) onSelectHRTicket?.(item.id);
      else onSelectITTicket?.(item.id);
    } else {
      onClose?.();
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[300]">
      <div
        ref={panelRef}
        className="absolute bg-white flex flex-col overflow-hidden"
        style={{
          top: pillRect ? pillRect.top : 8,
          left: pillRect ? pillRect.left : '50%',
          transform: pillRect ? 'none' : 'translateX(-50%)',
          width: pillRect ? pillRect.width : 560,
          maxHeight: expanded
            ? `calc(100vh - ${(pillRect?.top ?? 8) + 16}px)`
            : `${pillRect?.height ?? 28}px`,
          borderRadius: expanded ? '10px' : `${(pillRect?.height ?? 28) / 2}px`,
          transition: 'max-height 220ms cubic-bezier(0.2, 0, 0, 1), border-radius 120ms ease',
          boxShadow: '0 4px 6px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.14)',
        }}
      >
        {/* ── Input ── */}
        <div
          className="flex items-center gap-2.5 shrink-0"
          style={{ height: pillRect?.height ?? 28, padding: '0 10px 0 32px', position: 'relative' }}
        >
          <span className="absolute flex items-center" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3F6AC4', pointerEvents: 'none' }}>
            <SearchIcon size={12} />
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask or search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
            className="flex-1 text-xs text-[#1d1f21] placeholder:text-[#9ea0a2] focus:outline-none bg-transparent"
            style={{ minWidth: 0 }}
          />
        </div>

        <div style={{ height: 1, background: '#EDEAE9', flexShrink: 0 }} />

        {/* ── Pills row ── */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 shrink-0 overflow-x-auto"
          style={{ borderBottom: '1px solid #EDEAE9', scrollbarWidth: 'none' }}
        >
          {/* Single mode scope selector */}
          <ModeScopePill
            activeContext={activeContext}
            open={scopeOpen}
            onOpenDropdown={() => setScopeOpen(o => !o)}
            onSelectMode={type => { setActiveContext(type); setSubFilter(null); setScopeOpen(false); }}
            onClear={() => { setActiveContext(null); setSubFilter(null); }}
          />

          {/* Divider — only when a mode is scoped */}
          {ctxConfig && (
            <span style={{ width: 1, height: 16, background: '#D1D5DB', flexShrink: 0, margin: '0 2px' }} />
          )}

          {/* Mode sub-pills when scoped, entity pills otherwise */}
          {(ctxConfig ? ctxConfig.subPills : ENTITY_PILLS).map(({ type, label }) => (
            <FilterPill
              key={type}
              type={type}
              label={label}
              active={subFilter === type}
              onToggle={() => setSubFilter(prev => prev === type ? null : type)}
            />
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {!q ? (
            <div className="py-2">
              <div className="px-4 pt-2 pb-1 text-xs font-semibold text-[#6D6E6F]">
                Recents
              </div>
              {recents.map(item => (
                <RecentRow key={item.id} item={item} onSelect={handleRecentSelect} />
              ))}
            </div>
          ) : (
            <div className="py-2">
              {/* Global search results */}
              {isGlobal && globalTicketResults.length > 0 && (
                <ResultSection
                  title="Tickets"
                  items={globalTicketResults}
                  renderItem={ticket => (
                    <TicketResultRow
                      ticket={ticket}
                      query={query.trim()}
                      onClick={() => {
                        if (ticket.id.startsWith('HR-')) onSelectHRTicket(ticket.id);
                        else onSelectITTicket(ticket.id);
                      }}
                    />
                  )}
                />
              )}
              {isGlobal && globalKBResults.length > 0 && (
                <ResultSection
                  title="Knowledge Base"
                  items={globalKBResults}
                  renderItem={article => <KBResultRow article={article} query={query.trim()} />}
                />
              )}
              {isGlobal && globalTaskResults.length > 0 && (
                <ResultSection
                  title="Tasks"
                  items={globalTaskResults}
                  renderItem={task => <TaskResultRow task={task} query={query.trim()} />}
                />
              )}
              {isGlobal && globalPeopleResults.length > 0 && (
                <ResultSection
                  title="People"
                  items={globalPeopleResults}
                  renderItem={person => <PersonResultRow person={person} query={query.trim()} />}
                />
              )}
              {/* Context-scoped results */}
              {showTickets && ticketResults.length > 0 && (
                <ResultSection
                  title="Tickets"
                  items={ticketResults}
                  renderItem={ticket => (
                    <TicketResultRow
                      ticket={ticket}
                      query={query.trim()}
                      onClick={() => {
                        if (ticket.id.startsWith('HR-')) onSelectHRTicket(ticket.id);
                        else onSelectITTicket(ticket.id);
                      }}
                    />
                  )}
                />
              )}
              {showKnowledge && kbResults.length > 0 && (
                <ResultSection
                  title="Knowledge Base"
                  items={kbResults}
                  renderItem={article => <KBResultRow article={article} query={query.trim()} />}
                />
              )}
              {showPeople && peopleResults.length > 0 && (
                <ResultSection
                  title="People"
                  items={peopleResults}
                  renderItem={person => <PersonResultRow person={person} query={query.trim()} />}
                />
              )}
              {!hasResults && (
                <div className="px-4 py-10 text-sm text-[#9ea0a2] text-center">
                  No results for &ldquo;{query}&rdquo;
                  {ctxConfig && <div className="mt-1 text-xs">in {ctxConfig.label}</div>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-4 py-3" style={{ borderTop: '1px solid #EDEAE9' }}>
          <button type="button" className="flex items-center gap-2 text-sm text-[#3F6AC4] hover:underline w-full">
            <SearchIcon size={14} />
            View all results
          </button>
        </div>

      </div>
    </div>
  );
}
