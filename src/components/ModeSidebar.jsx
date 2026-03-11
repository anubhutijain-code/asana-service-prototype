// ─── ModeSidebar ──────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ── Mode icons ────────────────────────────────────────────────────────────────

function CheckCircleIcon({ className }) {
  return (
    <svg viewBox="30 14 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M37.9995 14.0035C33.5885 14.0035 29.9995 17.5575 29.9995 21.9685C29.9995 26.3795 33.5885 29.9685 37.9995 29.9685C42.4105 29.9685 45.9995 26.3795 45.9995 21.9685C45.9995 17.5575 42.4105 14.0035 37.9995 14.0035ZM37.9995 28.9685C34.1395 28.9685 30.9995 25.8285 30.9995 21.9685C30.9995 18.1085 34.1395 14.9685 37.9995 14.9685C41.8595 14.9685 44.9995 18.1085 44.9995 21.9685C44.9995 25.8285 41.8595 28.9685 37.9995 28.9685ZM41.35 19.7235C41.4444 19.8165 41.498 19.9431 41.4992 20.0755C41.5003 20.208 41.4488 20.3355 41.356 20.43L36.7525 25.106C36.7059 25.1533 36.6504 25.1908 36.5892 25.2164C36.528 25.2421 36.4624 25.2552 36.396 25.2552C36.3297 25.2552 36.264 25.2421 36.2028 25.2164C36.1416 25.1908 36.0861 25.1533 36.0395 25.106L34.143 23.179C34.097 23.1322 34.0606 23.0768 34.036 23.0159C34.0114 22.9551 33.999 22.8899 33.9996 22.8243C34.0001 22.7586 34.0136 22.6937 34.0393 22.6333C34.0649 22.5729 34.1022 22.5181 34.149 22.472C34.1958 22.426 34.2513 22.3897 34.3121 22.365C34.373 22.3404 34.4381 22.3281 34.5038 22.3286C34.5694 22.3292 34.6343 22.3427 34.6947 22.3683C34.7552 22.3939 34.81 22.4312 34.856 22.478L36.396 24.043L40.643 19.729C40.736 19.6345 40.8627 19.5808 40.9953 19.5796C41.1279 19.5785 41.2555 19.6306 41.35 19.7235Z" />
    </svg>
  );
}

function PlanIcon({ className }) {
  return (
    <svg viewBox="30 74 16 15" className={className} aria-hidden="true" focusable="false">
      <path d="M39.767 75.7085C39.5759 75.414 39.314 75.1719 39.0054 75.0045C38.6968 74.8371 38.3511 74.7496 38 74.75C37.285 74.75 36.6245 75.108 36.2335 75.708L30.35 84.7215C30.1378 85.0405 30.0173 85.4117 30.0015 85.7945C29.9858 86.1773 30.0753 86.5571 30.2605 86.8925C30.4389 87.2293 30.7063 87.5106 31.0336 87.7059C31.3608 87.9012 31.7354 88.0029 32.1165 88H43.883C44.2641 88.0029 44.6387 87.9012 44.9659 87.7059C45.2932 87.5106 45.5606 87.2293 45.739 86.8925C45.9243 86.5571 46.0139 86.1773 45.9981 85.7945C45.9823 85.4116 45.8617 85.0405 45.6495 84.7215L39.767 75.708V75.7085ZM44.86 86.417C44.7662 86.5944 44.6254 86.7426 44.4532 86.8455C44.2809 86.9484 44.0837 87.002 43.883 87.0005H32.1165C31.9159 87.002 31.7187 86.9484 31.5465 86.8455C31.3743 86.7426 31.2337 86.5944 31.14 86.417C31.0422 86.2396 30.9949 86.0388 31.0032 85.8364C31.0115 85.6341 31.0751 85.4378 31.187 85.269L37.071 76.255C37.1704 76.0991 37.3078 75.971 37.4703 75.8827C37.6328 75.7945 37.8151 75.749 38 75.7505C38.3815 75.7505 38.72 75.9345 38.93 76.2555L44.8135 85.269C45.042 85.6195 45.0585 86.0485 44.86 86.417Z" />
    </svg>
  );
}

function WorkflowIcon({ className }) {
  return (
    <svg viewBox="30 134 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M41.5 140H43.5C44.327 140 45 139.327 45 138.5V136.5C45 135.673 44.327 135 43.5 135H41.5C40.673 135 40 135.673 40 136.5V137H36.202C35.966 135.722 34.845 134.75 33.5 134.75C32.7709 134.751 32.072 135.041 31.5565 135.556C31.041 136.072 30.7509 136.771 30.75 137.5C30.75 138.845 31.722 139.966 33 140.202V144H32.5C31.673 144 31 144.673 31 145.5V147.5C31 148.327 31.673 149 32.5 149H34.5C35.327 149 36 148.327 36 147.5V147H43.293L41.6465 148.646C41.5527 148.74 41.5001 148.867 41.5001 149C41.5001 149.133 41.5527 149.26 41.6465 149.354C41.7403 149.447 41.8674 149.5 42 149.5C42.1326 149.5 42.2597 149.447 42.3535 149.354L44.8535 146.854C44.9 146.807 44.9368 146.752 44.962 146.691C44.9872 146.631 45.0001 146.566 45.0001 146.5C45.0001 146.434 44.9872 146.369 44.962 146.309C44.9368 146.248 44.9 146.193 44.8535 146.146L42.3535 143.646C42.2597 143.553 42.1326 143.5 42 143.5C41.8674 143.5 41.7403 143.553 41.6465 143.646C41.5527 143.74 41.5001 143.867 41.5001 144C41.5001 144.133 41.5527 144.26 41.6465 144.354L43.293 146H36V145.5C36 144.673 35.327 144 34.5 144H34V140.202C34.5463 140.1 35.049 139.835 35.442 139.442C35.835 139.049 36.1 138.546 36.202 138H40V138.5C40 139.327 40.673 140 41.5 140Z" />
    </svg>
  );
}

function CompanyIcon({ className }) {
  return (
    <svg viewBox="30 194 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M40.5 202.98C42.7055 202.98 44.5 201.185 44.5 198.98C44.5 196.774 42.7055 194.98 40.5 194.98C38.2945 194.98 36.5 196.774 36.5 198.98C36.5 201.185 38.2945 202.98 40.5 202.98ZM40.5 195.98C42.1545 195.98 43.5 197.325 43.5 198.98C43.5 200.634 42.1545 201.98 40.5 201.98C38.8455 201.98 37.5 200.634 37.5 198.98C37.5 197.325 38.8455 195.98 40.5 195.98ZM46 207.515V208.48C46 208.613 45.9473 208.74 45.8536 208.834C45.7598 208.927 45.6326 208.98 45.5 208.98C45.3674 208.98 45.2402 208.927 45.1464 208.834C45.0527 208.74 45 208.613 45 208.48V207.515C44.9991 206.843 44.7316 206.199 44.2563 205.723C43.781 205.248 43.1366 204.981 42.4645 204.98H38.536C37.8639 204.981 37.2195 205.248 36.7442 205.723C36.2689 206.199 36.0014 206.843 36.0005 207.515V208.48C36.0005 208.613 35.9478 208.74 35.8541 208.834C35.7603 208.927 35.6331 208.98 35.5005 208.98C35.3679 208.98 35.2407 208.927 35.1469 208.834C35.0532 208.74 35.0005 208.613 35.0005 208.48V207.515C35.0017 206.578 35.3746 205.679 36.0374 205.016C36.7002 204.354 37.5987 203.981 38.536 203.98H42.4645C43.4018 203.981 44.3003 204.354 44.9631 205.016C45.6259 205.679 45.9988 206.578 46 207.515ZM32.5 198.98C32.5 200.634 33.8455 201.98 35.5 201.98C35.6326 201.98 35.7598 202.033 35.8536 202.126C35.9473 202.22 36 202.347 36 202.48C36 202.613 35.9473 202.74 35.8536 202.834C35.7598 202.927 35.6326 202.98 35.5 202.98C33.2945 202.98 31.5 201.185 31.5 198.98C31.5 196.774 33.2945 194.98 35.5 194.98C35.6326 194.98 35.7598 195.033 35.8536 195.126C35.9473 195.22 36 195.347 36 195.48C36 195.613 35.9473 195.74 35.8536 195.834C35.7598 195.927 35.6326 195.98 35.5 195.98C33.8455 195.98 32.5 197.325 32.5 198.98ZM30 207.515C30.0013 206.578 30.3743 205.679 31.037 205.017C31.6998 204.354 32.5983 203.981 33.5355 203.98H34.5C34.6326 203.98 34.7598 204.033 34.8536 204.126C34.9473 204.22 35 204.347 35 204.48C35 204.613 34.9473 204.74 34.8536 204.834C34.7598 204.927 34.6326 204.98 34.5 204.98H33.5355C32.8634 204.981 32.219 205.248 31.7437 205.723C31.2684 206.199 31.0009 206.843 31 207.515V208.48C31 208.613 30.9473 208.74 30.8536 208.834C30.7598 208.927 30.6326 208.98 30.5 208.98C30.3674 208.98 30.2402 208.927 30.1464 208.834C30.0527 208.74 30 208.613 30 208.48V207.515Z" />
    </svg>
  );
}

function ServiceIcon({ className }) {
  return (
    <svg viewBox="35 254 16 17" className={className} aria-hidden="true" focusable="false">
      <path d="M48.999 255H36.999C35.896 255 34.999 255.897 34.999 257V264C34.999 265.103 35.896 266 36.999 266H42.499V269H38.499C38.3664 269 38.2392 269.053 38.1455 269.146C38.0517 269.24 37.999 269.367 37.999 269.5C37.999 269.633 38.0517 269.76 38.1455 269.854C38.2392 269.947 38.3664 270 38.499 270H47.499C47.6316 270 47.7588 269.947 47.8526 269.854C47.9463 269.76 47.999 269.633 47.999 269.5C47.999 269.367 47.9463 269.24 47.8526 269.146C47.7588 269.053 47.6316 269 47.499 269H43.499V266H48.999C50.102 266 50.999 265.103 50.999 264V257C50.999 255.897 50.102 255 48.999 255ZM49.999 264C49.999 264.552 49.5505 265 48.999 265H36.999C36.4475 265 35.999 264.552 35.999 264V257C35.999 256.448 36.4475 256 36.999 256H48.999C49.5505 256 49.999 256.448 49.999 257V264Z" />
    </svg>
  );
}

// ── Filled icon variants (active/selected state) ─────────────────────────────

function ServiceIconFilled({ className }) {
  return (
    <svg viewBox="35 254 16 17" className={className} aria-hidden="true" focusable="false">
      <path d="M48.999 255H36.999C35.896 255 34.999 255.897 34.999 257V264C34.999 265.103 35.896 266 36.999 266H42.499V269H38.499C38.3664 269 38.2392 269.053 38.1455 269.146C38.0517 269.24 37.999 269.367 37.999 269.5C37.999 269.633 38.0517 269.76 38.1455 269.854C38.2392 269.947 38.3664 270 38.499 270H47.499C47.6316 270 47.7588 269.947 47.8526 269.854C47.9463 269.76 47.999 269.633 47.999 269.5C47.999 269.367 47.9463 269.24 47.8526 269.146C47.7588 269.053 47.6316 269 47.499 269H43.499V266H48.999C50.102 266 50.999 265.103 50.999 264V257C50.999 255.897 50.102 255 48.999 255Z" />
    </svg>
  );
}

function CheckCircleIconFilled({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M7.99951 -0.0314941C3.58851 -0.0314941 -0.000488281 3.55751 -0.000488281 7.96851C-0.000488281 12.3795 3.58851 15.9685 7.99951 15.9685C12.4105 15.9685 15.9995 12.3795 15.9995 7.96851C15.9995 3.55751 12.4105 -0.0314941 7.99951 -0.0314941ZM11.6625 6.60951L6.98501 11.2855C6.91546 11.3553 6.83278 11.4107 6.74173 11.4485C6.65069 11.4862 6.55308 11.5056 6.45451 11.5055C6.26251 11.5055 6.07051 11.432 5.92451 11.2855L3.99701 9.35851C3.9242 9.2896 3.86594 9.2068 3.82567 9.115C3.78541 9.02319 3.76396 8.92424 3.76259 8.82401C3.76122 8.72377 3.77996 8.62428 3.8177 8.5314C3.85544 8.43853 3.91141 8.35417 3.98231 8.2833C4.05322 8.21243 4.13761 8.1565 4.23049 8.1188C4.32338 8.0811 4.42289 8.06241 4.52312 8.06383C4.62336 8.06525 4.7223 8.08675 4.81408 8.12705C4.90587 8.16736 4.98864 8.22566 5.05751 8.29851L6.45401 9.69451L10.6015 5.54951C10.6707 5.47784 10.7534 5.42067 10.8449 5.38132C10.9364 5.34197 11.0348 5.32123 11.1344 5.32032C11.2339 5.31941 11.3327 5.33834 11.4249 5.37601C11.5171 5.41367 11.6008 5.46932 11.6713 5.53971C11.7418 5.61009 11.7975 5.69381 11.8352 5.78596C11.873 5.87811 11.892 5.97687 11.8912 6.07645C11.8904 6.17603 11.8697 6.27446 11.8305 6.36598C11.7912 6.4575 11.7341 6.54029 11.6625 6.60951Z" />
    </svg>
  );
}

function PlanIconFilled({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M9.76756 1.7085C9.37606 1.1085 8.71556 0.75 8.00006 0.75C7.28456 0.75 6.62406 1.108 6.23306 1.708L0.348053 10.7215C-0.0849465 11.3845 -0.118447 12.196 0.258553 12.8925C0.634051 13.586 1.32806 14 2.11506 14H13.8846C14.6716 14 15.3656 13.586 15.7411 12.8925C16.1181 12.196 16.0851 11.3845 15.6516 10.7215L9.76756 1.7085Z" />
    </svg>
  );
}

function WorkflowIconFilled({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M11.5 6H13.5C14.327 6 15 5.327 15 4.5V2.5C15 1.673 14.327 1 13.5 1H11.5C10.673 1 10 1.673 10 2.5V3H6.202C5.966 1.722 4.845 0.75 3.5 0.75C2.77094 0.750926 2.072 1.04095 1.55648 1.55648C1.04095 2.072 0.750926 2.77094 0.75 3.5C0.75 4.845 1.722 5.966 3 6.202V10H2.5C1.673 10 1 10.673 1 11.5V13.5C1 14.327 1.673 15 2.5 15H4.5C5.327 15 6 14.327 6 13.5V13H13.293L11.6465 14.6465C11.5527 14.7403 11.5001 14.8674 11.5001 15C11.5001 15.1326 11.5527 15.2597 11.6465 15.3535C11.7403 15.4473 11.8674 15.4999 12 15.4999C12.1326 15.4999 12.2597 15.4473 12.3535 15.3535L14.8535 12.8535C14.9 12.8071 14.9368 12.752 14.962 12.6913C14.9872 12.6307 15.0001 12.5657 15.0001 12.5C15.0001 12.4343 14.9872 12.3693 14.962 12.3087C14.9368 12.248 14.9 12.1929 14.8535 12.1465L12.3535 9.6465C12.2597 9.55275 12.1326 9.50008 12 9.50008C11.8674 9.50008 11.7403 9.55275 11.6465 9.6465C11.5527 9.74025 11.5001 9.86741 11.5001 10C11.5001 10.1326 11.5527 10.2597 11.6465 10.3535L13.293 12H6V11.5C6 10.673 5.327 10 4.5 10H4V6.202C4.54634 6.09997 5.04904 5.83504 5.44204 5.44204C5.83504 5.04904 6.09997 4.54634 6.202 4H10V4.5C10 5.327 10.673 6 11.5 6ZM11 2.5C11 2.36739 11.0527 2.24021 11.1464 2.14645C11.2402 2.05268 11.3674 2 11.5 2H13.5C13.6326 2 13.7598 2.05268 13.8536 2.14645C13.9473 2.24021 14 2.36739 14 2.5V4.5C14 4.63261 13.9473 4.75979 13.8536 4.85355C13.7598 4.94732 13.6326 5 13.5 5H11.5C11.3674 5 11.2402 4.94732 11.1464 4.85355C11.0527 4.75979 11 4.63261 11 4.5V2.5ZM4.5 11C4.63261 11 4.75979 11.0527 4.85355 11.1464C4.94732 11.2402 5 11.3674 5 11.5V13.5C5 13.6326 4.94732 13.7598 4.85355 13.8536C4.75979 13.9473 4.63261 14 4.5 14H2.5C2.36739 14 2.24021 13.9473 2.14645 13.8536C2.05268 13.7598 2 13.6326 2 13.5V11.5C2 11.3674 2.05268 11.2402 2.14645 11.1464C2.24021 11.0527 2.36739 11 2.5 11H4.5ZM3.5 5.25C2.535 5.25 1.75 4.465 1.75 3.5C1.75 2.535 2.535 1.75 3.5 1.75C4.465 1.75 5.25 2.535 5.25 3.5C5.25 4.465 4.465 5.25 3.5 5.25Z" />
    </svg>
  );
}

function CompanyIconFilled({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M16 13.515V14.48C16 14.6126 15.9473 14.7398 15.8536 14.8336C15.7598 14.9273 15.6326 14.98 15.5 14.98H5.5C5.36739 14.98 5.24021 14.9273 5.14645 14.8336C5.05268 14.7398 5 14.6126 5 14.48V13.515C5.00119 12.5777 5.37408 11.6792 6.03687 11.0165C6.69966 10.3538 7.59824 9.98107 8.5355 9.98001H12.464C14.4135 9.98001 16 11.5655 16 13.515ZM10.5 8.73001C12.568 8.73001 14.25 7.04751 14.25 4.98001C14.25 2.91151 12.568 1.23001 10.5 1.23001C8.432 1.23001 6.75 2.91151 6.75 4.98001C6.75 7.04751 8.432 8.73001 10.5 8.73001ZM6.43 1.34801C5.86395 1.20115 5.27124 1.18984 4.7 1.31501C3.244 1.62751 2.08 2.81501 1.8135 4.28051C1.71173 4.82255 1.73059 5.38036 1.86875 5.91429C2.00691 6.44822 2.26097 6.94517 2.61288 7.36982C2.96479 7.79447 3.40591 8.1364 3.9049 8.37131C4.40388 8.60622 4.94848 8.72835 5.5 8.72901C5.82 8.72901 6.1305 8.68751 6.4265 8.61101C6.781 8.51901 6.9175 8.10251 6.6975 7.80951C6.08235 6.99449 5.7497 6.00112 5.75 4.98001C5.75 3.91701 6.1 2.93701 6.6905 2.14551C6.906 1.85651 6.779 1.44051 6.4305 1.34901L6.43 1.34801ZM4.526 9.98001H3.5355C2.59791 9.98001 1.69872 10.3524 1.0357 11.0154C0.37268 11.6783 0.000132596 12.5774 0 13.515L0 14.48C0 14.6126 0.0526784 14.7398 0.146447 14.8336C0.240215 14.9273 0.367392 14.98 0.5 14.98H3.5C3.63261 14.98 3.75979 14.9273 3.85355 14.8336C3.94732 14.7398 4 14.6126 4 14.48V13.515C4 12.4865 4.345 11.5375 4.925 10.7765C5.174 10.449 4.9375 9.98001 4.526 9.98001Z" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg viewBox="34 834 8 8" className={className} aria-hidden="true" focusable="false">
      <path d="M35.001 839H37.001V841C37.001 841.265 37.1063 841.52 37.2939 841.707C37.4814 841.895 37.7358 842 38.001 842C38.2662 842 38.5205 841.895 38.7081 841.707C38.8956 841.52 39.001 841.265 39.001 841V839H41.001C41.2662 839 41.5205 838.895 41.7081 838.707C41.8956 838.52 42.001 838.265 42.001 838C42.001 837.735 41.8956 837.48 41.7081 837.293C41.5205 837.105 41.2662 837 41.001 837H39.001V835C39.001 834.735 38.8956 834.48 38.7081 834.293C38.5205 834.105 38.2662 834 38.001 834C37.7358 834 37.4814 834.105 37.2939 834.293C37.1063 834.48 37.001 834.735 37.001 835V837H35.001C34.7358 837 34.4814 837.105 34.2939 837.293C34.1063 837.48 34.001 837.735 34.001 838C34.001 838.265 34.1063 838.52 34.2939 838.707C34.4814 838.895 34.7358 839 35.001 839Z" />
    </svg>
  );
}

function InboxIcon({ className }) {
  return (
    <svg viewBox="30 871 16 14" className={className} aria-hidden="true" focusable="false">
      <path d="M42.999 872H32.999C31.3445 872 29.999 873.345 29.999 875V881C29.999 882.655 31.3445 884 32.999 884H42.999C44.654 884 45.999 882.655 45.999 881V875C45.999 873.345 44.654 872 42.999 872ZM32.999 873H42.999C43.369 873 43.711 873.107 44.009 873.283L38.352 878.939C38.2583 879.033 38.1311 879.086 37.9985 879.086C37.8659 879.086 37.7388 879.033 37.645 878.939L31.99 873.283C32.2951 873.1 32.644 873.002 33 873H32.999ZM44.999 881C44.999 882.103 44.102 883 42.999 883H32.999C31.896 883 30.999 882.103 30.999 881V875C30.999 874.63 31.1065 874.288 31.2825 873.99L36.9385 879.647C37.0778 879.786 37.2431 879.897 37.4251 879.972C37.6071 880.047 37.8021 880.085 37.999 880.085C38.196 880.085 38.391 880.047 38.573 879.972C38.755 879.896 38.9204 879.786 39.0595 879.646L44.7155 873.99C44.899 874.295 44.997 874.644 44.999 875V881Z" />
    </svg>
  );
}

// ── Nav data ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'service',  label: 'Service',  Icon: ServiceIcon,     IconFilled: ServiceIconFilled,     badge: null },
  { id: 'work',     label: 'Work',     Icon: CheckCircleIcon, IconFilled: CheckCircleIconFilled, badge: null },
  { id: 'plan',     label: 'Strategy', Icon: PlanIcon,        IconFilled: PlanIconFilled,        badge: null },
  { id: 'workflow', label: 'Workflow', Icon: WorkflowIconFilled, IconFilled: WorkflowIcon,        badge: null },
  { id: 'company',  label: 'People',   Icon: CompanyIcon,     IconFilled: CompanyIconFilled,     badge: null },
];

const ROLES = [
  { id: 'admin',  label: 'Admin'   },
  { id: 'admin2', label: 'Admin 2' },
  { id: 'agent',  label: 'Agent'   },
  { id: 'agent3', label: 'Agent 3' },
];

// ── NavItem ────────────────────────────────────────────────────────────────────

function NavItem({ id, label, Icon, IconFilled, badge, active, onClick }) {
  const DisplayIcon = (active && IconFilled) ? IconFilled : Icon;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={[
        'group w-full flex flex-col items-center justify-center gap-1 py-2 px-1.5',
        'cursor-pointer border-0 bg-transparent',
        'transition-colors duration-150',
        'text-icon hover:text-text',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
      ].join(' ')}
    >
      <div className={[
        'relative flex items-center justify-center w-8 h-8 rounded-[6px] transition-colors duration-150',
        active ? 'bg-[var(--background-active)]' : 'group-hover:bg-[var(--background-hover)]',
      ].join(' ')}>
        <DisplayIcon className="w-4 h-4 fill-current shrink-0" />
        {badge != null && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5
                           bg-creation text-white text-[9px] font-bold leading-none
                           rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
  );
}

// ── ModeSidebar ────────────────────────────────────────────────────────────────

export default function ModeSidebar({ active, onSelect, role, onRoleChange }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        avatarRef.current && !avatarRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  function handleAvatarClick() {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setDropdownPos({
        bottom: window.innerHeight - rect.bottom,
        left: rect.right + 8,
      });
    }
    setProfileOpen(o => !o);
  }

  function handleRoleSelect(r) {
    onRoleChange?.(r);
    setProfileOpen(false);
  }

  return (
    <aside className="flex flex-col w-16 h-full bg-background-strong shrink-0" aria-label="Mode navigation">
      <nav className="flex flex-col gap-0.5 flex-1 pt-2 px-1.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, Icon, IconFilled, badge }) => (
          <NavItem
            key={id}
            id={id}
            label={label}
            Icon={Icon}
            IconFilled={IconFilled}
            badge={badge}
            active={active === id}
            onClick={onSelect}
          />
        ))}
      </nav>

      <div className="flex flex-col items-center gap-3 pb-4 pt-2">
        {/* Create button */}
        <button
          type="button"
          aria-label="Create new"
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0
                     bg-creation text-white fill-white border-0
                     hover:bg-creation-hover active:bg-[#e52e19]
                     shadow-sm transition-colors duration-150 cursor-pointer
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-creation focus-visible:ring-offset-1"
        >
          <PlusIcon className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Inbox */}
        <button
          type="button"
          aria-label="Inbox"
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0
                     text-icon fill-current border-0 bg-transparent
                     hover:text-text
                     transition-colors duration-150 cursor-pointer
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <InboxIcon className="w-4 h-4 fill-current" />
        </button>

        {/* Avatar */}
        <button
          ref={avatarRef}
          type="button"
          aria-label="My profile"
          onClick={handleAvatarClick}
          className="w-7 h-7 rounded-full overflow-hidden border-0
                     ring-1 ring-transparent hover:ring-[#c0c0c0]
                     transition-shadow duration-150 cursor-pointer
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <img
            src="https://placehold.co/28x28/c0856a/ffffff?text=U"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Profile dropdown — portalled to body to escape stacking context */}
      {profileOpen && dropdownPos && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            bottom: dropdownPos.bottom,
            left: dropdownPos.left,
            zIndex: 9999,
            width: 200,
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            fontFamily: SFT,
          }}
        >
          {/* User info */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Anubhuti Jain</div>
            <div style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 1 }}>anubhuti@company.com</div>
          </div>

          {/* Role options */}
          <div style={{ padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
            {ROLES.map(({ id, label }) => {
              const active = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleRoleSelect(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '7px 14px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: 13, fontFamily: SFT, textAlign: 'left',
                    color: active ? 'var(--text)' : 'var(--text-weak)',
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                    border: active ? '4px solid var(--selected-background-strong)' : '1.5px solid var(--border-strong)',
                    background: 'white',
                    display: 'inline-block',
                    boxSizing: 'border-box',
                  }} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Sign out */}
          <div style={{ padding: '4px 0' }}>
            <button
              type="button"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '7px 14px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13, fontFamily: SFT, color: 'var(--text-weak)', textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Sign out
            </button>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}
