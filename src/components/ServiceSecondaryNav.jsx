// ─── ServiceSecondaryNav ──────────────────────────────────────────────────────

import { useState } from 'react';

// ── Icons (from Asana icon library) ───────────────────────────────────────────

function InboxIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M4.35132 11.2795C4.32954 11.2556 4.31516 11.2259 4.30994 11.194C4.30471 11.1621 4.30886 11.1293 4.32189 11.0997C4.33491 11.0701 4.35625 11.045 4.38331 11.0273C4.41037 11.0095 4.44199 11.0001 4.47432 11H7.52432C7.66782 11 7.74482 11.174 7.64682 11.28C7.43672 11.5072 7.18191 11.6885 6.89839 11.8124C6.61486 11.9364 6.30876 12.0004 5.99932 12.0004C5.68988 12.0004 5.38378 11.9364 5.10026 11.8124C4.81673 11.6885 4.56192 11.5072 4.35182 11.28L4.35132 11.2795ZM0.111321 9.2395C-0.103679 8.717 -0.00117865 8.1025 0.366321 7.711C0.768321 7.2815 0.998821 6.658 0.998821 6V5C0.998821 2.243 3.24182 0 5.99882 0C8.75582 0 10.9988 2.243 10.9988 5V6C10.9988 6.658 11.2293 7.282 11.6318 7.711C11.9988 8.103 12.1018 8.7175 11.8868 9.24C11.6973 9.702 11.2638 10.0005 10.7823 10.0005H1.21582C0.734321 10.0005 0.300821 9.702 0.110821 9.2405V9.2395H0.111321ZM1.03632 8.8595C1.07832 8.963 1.15932 8.9995 1.21632 8.9995H10.7823C10.8388 8.9995 10.9198 8.963 10.9623 8.8595C11.0373 8.6765 10.9888 8.487 10.9023 8.3945C10.3283 7.782 9.99882 6.9095 9.99882 5.9995V4.9995C9.99882 2.7945 8.20432 0.9995 5.99882 0.9995C3.79382 0.9995 1.99882 2.7945 1.99882 4.9995V5.9995C1.99882 6.9095 1.66932 7.7815 1.09532 8.3945C1.00882 8.487 0.960821 8.676 1.03632 8.8595Z" fill="currentColor"/>
    </svg>
  );
}

function TicketsIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M10.665 7.45901C10.7138 7.50487 10.7529 7.56008 10.78 7.62136C10.8071 7.68264 10.8216 7.74874 10.8226 7.81573C10.8237 7.88272 10.8113 7.94923 10.7861 8.01132C10.7609 8.07342 10.7235 8.12981 10.6761 8.17717C10.6287 8.22453 10.5723 8.26188 10.5102 8.287C10.4481 8.31213 10.3816 8.32452 10.3146 8.32343C10.2476 8.32234 10.1815 8.3078 10.1203 8.28067C10.059 8.25354 10.0038 8.21438 9.95798 8.16551L9.58298 7.79051C9.49561 7.69558 9.44831 7.57054 9.45098 7.44155C9.45365 7.31255 9.50609 7.18958 9.59732 7.09835C9.68855 7.00712 9.81152 6.95468 9.94052 6.95201C10.0695 6.94934 10.1945 6.99663 10.2895 7.08401L10.665 7.45901ZM8.54098 5.33501C8.44605 5.24763 8.32101 5.20034 8.19202 5.20301C8.06302 5.20568 7.94005 5.25812 7.84882 5.34935C7.75759 5.44058 7.70515 5.56355 7.70248 5.69255C7.69981 5.82154 7.7471 5.94658 7.83448 6.04151L8.20948 6.41651C8.25581 6.4631 8.31089 6.50008 8.37155 6.52531C8.43222 6.55054 8.49728 6.56353 8.56298 6.56353C8.62868 6.56353 8.69374 6.55054 8.75441 6.52531C8.81507 6.50008 8.87015 6.4631 8.91648 6.41651C9.01006 6.32277 9.06262 6.19572 9.06262 6.06326C9.06262 5.9308 9.01006 5.80375 8.91648 5.71001L8.54098 5.33501ZM15.703 7.11251L7.11298 15.7025C6.91898 15.8975 6.66248 15.9945 6.40698 15.9945C6.27575 15.9947 6.14577 15.969 6.02453 15.9188C5.90328 15.8686 5.79315 15.7949 5.70048 15.702L4.47048 14.472C4.40018 14.4018 4.35241 14.3122 4.33326 14.2146C4.31411 14.1171 4.32446 14.0161 4.36298 13.9245C4.49902 13.6045 4.53619 13.2512 4.46972 12.9099C4.40324 12.5686 4.23617 12.255 3.98998 12.0095C3.74456 11.763 3.43089 11.5957 3.08944 11.5292C2.748 11.4627 2.39447 11.5001 2.07448 11.6365C1.98295 11.675 1.88202 11.6853 1.78459 11.6662C1.68716 11.647 1.59765 11.5993 1.52748 11.529L0.29748 10.299C0.110162 10.1115 0.00494385 9.8573 0.00494385 9.59226C0.00494385 9.32722 0.110162 9.07302 0.29748 8.88551L8.88748 0.29701C9.0749 0.109722 9.32902 0.0045166 9.59398 0.0045166C9.85894 0.0045166 10.1131 0.109722 10.3005 0.29701L11.5305 1.52701C11.6008 1.59725 11.6486 1.68685 11.6677 1.78437C11.6868 1.88189 11.6765 1.9829 11.638 2.07451C11.5018 2.39455 11.4646 2.74801 11.5311 3.08939C11.5976 3.43077 11.7647 3.74444 12.011 3.99001C12.2565 4.23623 12.5701 4.40329 12.9114 4.46968C13.2527 4.53607 13.6061 4.49875 13.926 4.36251C14.0175 4.32372 14.1186 4.31323 14.2162 4.33239C14.3138 4.35154 14.4034 4.39948 14.4735 4.47001L15.7035 5.70001C15.8908 5.88752 15.996 6.14172 15.996 6.40676C15.996 6.6718 15.8908 6.926 15.7035 7.11351L15.703 7.11251ZM14.9965 6.40601L13.988 5.39751C13.5188 5.53067 13.0225 5.53584 12.5506 5.41248C12.0788 5.28913 11.6485 5.04175 11.3045 4.69601C10.9588 4.35183 10.7115 3.92148 10.5882 3.44955C10.4648 2.97763 10.4699 2.4813 10.603 2.01201L9.59498 1.00351L6.90248 3.69601L7.35498 4.14851C7.40382 4.19437 7.44294 4.24958 7.47003 4.31086C7.49711 4.37214 7.5116 4.43824 7.51265 4.50523C7.51369 4.57222 7.50125 4.63873 7.47608 4.70082C7.45092 4.76291 7.41353 4.81931 7.36613 4.86667C7.31874 4.91403 7.26232 4.95138 7.20021 4.9765C7.1381 5.00163 7.07158 5.01401 7.00459 5.01293C6.9376 5.01184 6.87151 4.9973 6.81025 4.97017C6.74899 4.94304 6.69381 4.90388 6.64798 4.85501L6.19548 4.40251L1.00448 9.59301L2.01298 10.6015C2.48218 10.4684 2.97846 10.4632 3.45033 10.5865C3.92221 10.7099 4.35247 10.9573 4.69648 11.303C5.04213 11.6472 5.28944 12.0775 5.41278 12.5495C5.53613 13.0214 5.53102 13.5177 5.39798 13.987L6.40598 14.9955L11.597 9.80501L11.1445 9.35251C11.0571 9.25758 11.0098 9.13254 11.0125 9.00355C11.0152 8.87455 11.0676 8.75158 11.1588 8.66035C11.2501 8.56912 11.373 8.51668 11.502 8.51401C11.631 8.51134 11.756 8.55863 11.851 8.64601L12.3035 9.09851L14.9955 6.40651L14.9965 6.40601Z" fill="currentColor"/>
    </svg>
  );
}

function DashboardIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M10 0.999023H2C0.897 0.999023 0 1.89602 0 2.99902V7.999C0 9.102 0.897 9.999 2 9.999H3.566L2.8505 11.251C2.7135 11.4905 2.797 11.796 3.0365 11.933C3.1145 11.9775 3.2 11.999 3.284 11.999C3.458 11.999 3.6265 11.9085 3.7185 11.747L4.7175 9.999H7.2605L8.345 11.761C8.439 11.9145 8.6035 11.999 8.7715 11.999C8.861 11.999 8.951 11.975 9.033 11.925C9.268 11.78 9.341 11.4725 9.1965 11.2375L8.4345 9.9995H10C11.103 9.9995 12 9.1025 12 7.9995V2.99952C12 1.89652 11.103 0.999023 10 0.999023ZM11 7.999C11 8.5505 10.5515 8.999 10 8.999H2C1.4485 8.999 1 8.5505 1 7.999V2.99902C1 2.44752 1.4485 1.99902 2 1.99902H10C10.5515 1.99902 11 2.44752 11 2.99902V7.999ZM9.344 3.63602C9.5445 3.82602 9.553 4.14252 9.363 4.34302L7.1525 6.6765C6.964 6.8755 6.6155 6.8755 6.427 6.6765L5.2105 5.393L3.363 7.343C3.265 7.447 3.1325 7.499 3 7.499C2.8765 7.499 2.753 7.4535 2.656 7.362C2.4555 7.172 2.447 6.8555 2.637 6.655L4.8475 4.32152C5.036 4.12252 5.3845 4.12252 5.573 4.32152L6.7895 5.605L8.637 3.65502C8.827 3.45402 9.1435 3.44652 9.3435 3.63552L9.344 3.63602Z" fill="currentColor"/>
    </svg>
  );
}

function LightBulbIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M8.49995 8.96472C8.49995 8.53972 8.67795 8.13772 8.98845 7.86172C9.46332 7.44011 9.84352 6.92272 10.104 6.3436C10.3646 5.76448 10.4995 5.13675 10.4999 4.50172C10.5002 3.86742 10.3663 3.24024 10.1072 2.66131C9.84799 2.08237 9.46935 1.56477 8.99609 1.14245C8.52282 0.720127 7.96562 0.402628 7.36103 0.210776C6.75644 0.0189239 6.11813 -0.0429467 5.48795 0.0292224C3.51395 0.248722 1.85945 1.82722 1.55495 3.78372C1.31745 5.31172 1.85895 6.83372 3.00345 7.85572C3.31845 8.13672 3.49895 8.54072 3.49895 8.96522V9.50172C3.49895 9.63433 3.55163 9.76151 3.64539 9.85528C3.73916 9.94904 3.86634 10.0017 3.99895 10.0017H7.99995C8.13256 10.0017 8.25973 9.94904 8.3535 9.85528C8.44727 9.76151 8.49995 9.63433 8.49995 9.50172V8.96422V8.96472ZM8.32345 7.11472C8.06329 7.34745 7.85537 7.63263 7.71334 7.95149C7.57132 8.27035 7.49842 8.61567 7.49945 8.96472V9.00172H4.49995V8.96472C4.50007 8.61443 4.4262 8.26806 4.28317 7.9483C4.14013 7.62855 3.93116 7.34261 3.66995 7.10922C3.23153 6.71727 2.89861 6.22145 2.70178 5.6673C2.50495 5.11314 2.4505 4.51841 2.54345 3.93772C2.77995 2.41872 4.06445 1.19372 5.59845 1.02372C6.60845 0.911222 7.58245 1.22022 8.33395 1.89272C8.7005 2.22142 8.99377 2.62361 9.19466 3.07311C9.39555 3.52261 9.49956 4.00937 9.49995 4.50172C9.49916 4.99567 9.39393 5.48387 9.19117 5.93428C8.98841 6.3847 8.6927 6.78715 8.32345 7.11522V7.11472ZM8.49995 11.5017C8.49995 11.6343 8.44727 11.7615 8.3535 11.8553C8.25973 11.949 8.13256 12.0017 7.99995 12.0017H3.99845C3.86584 12.0017 3.73866 11.949 3.64489 11.8553C3.55113 11.7615 3.49845 11.6343 3.49845 11.5017C3.49845 11.3691 3.55113 11.2419 3.64489 11.1482C3.73866 11.0544 3.86584 11.0017 3.99845 11.0017H7.99995C8.13256 11.0017 8.25973 11.0544 8.3535 11.1482C8.44727 11.2419 8.49995 11.3691 8.49995 11.5017Z" fill="currentColor"/>
    </svg>
  );
}

function AutomationIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M2.706 7H4.805L3.694 10.333C3.61985 10.5464 3.62143 10.7789 3.69846 10.9913C3.77549 11.2037 3.92328 11.3832 4.117 11.4995C4.2835 11.6025 4.4665 11.653 4.647 11.653C4.77791 11.6524 4.90741 11.6258 5.028 11.5749C5.14858 11.5239 5.25786 11.4495 5.3495 11.356L9.9985 6.707C10.1386 6.56738 10.2341 6.38925 10.2727 6.19525C10.3113 6.00126 10.2914 5.80015 10.2155 5.6175C10.1402 5.43449 10.0121 5.27803 9.84752 5.16807C9.68297 5.0581 9.48941 4.99959 9.2915 5H7.1915L8.303 1.667C8.37714 1.45355 8.37557 1.22109 8.29854 1.00867C8.22151 0.796252 8.07372 0.616812 7.88 0.5005C7.68931 0.379274 7.46272 0.327366 7.23828 0.353497C7.01384 0.379629 6.80523 0.482208 6.6475 0.644L1.9985 5.293C1.85838 5.43262 1.76293 5.61075 1.72429 5.80475C1.68566 5.99874 1.70557 6.19985 1.7815 6.3825C1.8568 6.56544 1.98482 6.72183 2.14927 6.8318C2.31372 6.94176 2.50717 7.00031 2.705 7H2.706ZM7.355 1.351L6.244 4.6835C6.19398 4.83382 6.18032 4.99386 6.20413 5.15048C6.22795 5.3071 6.28856 5.45584 6.381 5.5845C6.5685 5.845 6.871 6 7.1925 6H9.292L4.643 10.649L5.754 7.3165C5.80401 7.16618 5.81768 7.00614 5.79386 6.84952C5.77005 6.6929 5.70943 6.54416 5.617 6.4155C5.52421 6.2869 5.40221 6.18218 5.26105 6.10994C5.11988 6.03771 4.96357 6.00003 4.805 6H2.705L7.3545 1.351H7.355Z" fill="currentColor"/>
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M10.4995 8H4.94701C4.8314 7.43595 4.52482 6.92903 4.07897 6.5647C3.63313 6.20037 3.07528 6.00093 2.49951 6C1.12101 6 -0.000488281 7.1215 -0.000488281 8.5C-0.000488281 9.8785 1.12101 11 2.49951 11C3.07528 10.9991 3.63313 10.7996 4.07897 10.4353C4.52482 10.071 4.8314 9.56405 4.94701 9H10.4995C10.6321 9 10.7593 8.94732 10.8531 8.85355C10.9468 8.75979 10.9995 8.63261 10.9995 8.5C10.9995 8.36739 10.9468 8.24021 10.8531 8.14645C10.7593 8.05268 10.6321 8 10.4995 8ZM2.49951 10C1.67251 10 0.999512 9.327 0.999512 8.5C0.999512 7.673 1.67251 7 2.49951 7C3.32651 7 3.99951 7.673 3.99951 8.5C3.99951 9.327 3.32651 10 2.49951 10ZM9.49951 1C8.92374 1.00093 8.3659 1.20037 7.92005 1.5647C7.4742 1.92903 7.16763 2.43595 7.05201 3H1.49951C1.3669 3 1.23973 3.05268 1.14596 3.14645C1.05219 3.24021 0.999512 3.36739 0.999512 3.5C0.999512 3.63261 1.05219 3.75979 1.14596 3.85355C1.23973 3.94732 1.3669 4 1.49951 4H7.05201C7.16763 4.56405 7.4742 5.07097 7.92005 5.4353C8.3659 5.79963 8.92374 5.99907 9.49951 6C10.878 6 11.9995 4.8785 11.9995 3.5C11.9995 2.1215 10.878 1 9.49951 1ZM9.49951 5C8.67251 5 7.99951 4.327 7.99951 3.5C7.99951 2.673 8.67251 2 9.49951 2C10.3265 2 10.9995 2.673 10.9995 3.5C10.9995 4.327 10.3265 5 9.49951 5Z" fill="currentColor"/>
    </svg>
  );
}

function OptimizeIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M11.7685 1.57824C11.7131 1.54296 11.6513 1.51894 11.5866 1.50756C11.5219 1.49618 11.4556 1.49766 11.3915 1.51191C11.3273 1.52617 11.2666 1.55292 11.2129 1.59064C11.1591 1.62836 11.1133 1.67631 11.078 1.73174L7.82001 6.85124L4.22351 5.05274C4.12004 5.00121 4.00193 4.98705 3.8892 5.01266C3.77648 5.03826 3.67607 5.10207 3.60501 5.19324L0.105015 9.69324C0.0633596 9.74495 0.0324207 9.80444 0.0140035 9.86823C-0.00441366 9.93202 -0.00994018 9.99885 -0.00225351 10.0648C0.00543316 10.1308 0.026179 10.1945 0.0587734 10.2524C0.0913678 10.3102 0.135158 10.361 0.187588 10.4017C0.240018 10.4425 0.300037 10.4724 0.364144 10.4897C0.42825 10.507 0.49516 10.5113 0.560967 10.5025C0.626775 10.4936 0.690162 10.4718 0.74743 10.4382C0.804697 10.4046 0.854698 10.3599 0.894515 10.3067L4.14301 6.13024L7.77652 7.94674C7.88713 8.00211 8.01434 8.0145 8.13356 7.98153C8.25279 7.94857 8.35556 7.87257 8.42201 7.76824L11.922 2.26824C11.9931 2.15638 12.0169 2.02085 11.9881 1.89147C11.9593 1.76208 11.8803 1.64942 11.7685 1.57824Z" fill="currentColor"/>
    </svg>
  );
}

function AssetsIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M13.999 1H1.99899C0.895993 1 -0.00100708 1.897 -0.00100708 3V10C-0.00100708 11.103 0.895993 12 1.99899 12H7.49899V15H3.49899C3.36638 15 3.23921 15.0527 3.14544 15.1464C3.05167 15.2402 2.99899 15.3674 2.99899 15.5C2.99899 15.6326 3.05167 15.7598 3.14544 15.8536C3.23921 15.9473 3.36638 16 3.49899 16H12.499C12.6316 16 12.7588 15.9473 12.8525 15.8536C12.9463 15.7598 12.999 15.6326 12.999 15.5C12.999 15.3674 12.9463 15.2402 12.8525 15.1464C12.7588 15.0527 12.6316 15 12.499 15H8.49899V12H13.999C15.102 12 15.999 11.103 15.999 10V3C15.999 1.897 15.102 1 13.999 1ZM14.999 10C14.999 10.5515 14.5505 11 13.999 11H1.99899C1.44749 11 0.998993 10.5515 0.998993 10V3C0.998993 2.4485 1.44749 2 1.99899 2H13.999C14.5505 2 14.999 2.4485 14.999 3V10Z" fill="currentColor"/>
    </svg>
  );
}

function HomeIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M15.7865 6.09046L8.859 1.24196C8.6068 1.06632 8.30684 0.972168 7.9995 0.972168C7.69217 0.972168 7.39221 1.06632 7.14 1.24196L0.212503 6.09046C0.103831 6.16651 0.0298201 6.28261 0.0067531 6.41323C-0.0163139 6.54385 0.0134521 6.67829 0.089503 6.78696C0.165554 6.89563 0.28166 6.96964 0.412279 6.99271C0.542898 7.01577 0.677331 6.98601 0.786003 6.90996L2 6.05996V11.5C2 13.43 3.5705 15 5.5 15H10.5C12.43 15 14 13.43 14 11.5V6.05996L15.214 6.90996C15.2677 6.94773 15.3283 6.97452 15.3924 6.98879C15.4564 7.00306 15.5227 7.00451 15.5873 6.99308C15.652 6.98165 15.7137 6.95756 15.769 6.92218C15.8243 6.88681 15.872 6.84085 15.9095 6.78696C15.9472 6.73318 15.9739 6.67251 15.9882 6.6084C16.0024 6.5443 16.0039 6.47801 15.9925 6.41333C15.9812 6.34865 15.9571 6.28685 15.9219 6.23145C15.8866 6.17605 15.8403 6.12814 15.7865 6.09046ZM13 11.5C13 12.8785 11.878 14 10.5 14H5.5C4.121 14 3 12.8785 3 11.5V5.35996L7.7135 2.06096C7.8855 1.94096 8.115 1.94096 8.2865 2.06096L13 5.35996V11.5Z" fill="currentColor"/>
    </svg>
  );
}

function OverviewIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="5" height="5" rx="1"/>
      <rect x="7" y="0" width="5" height="5" rx="1"/>
      <rect x="0" y="7" width="5" height="5" rx="1"/>
      <rect x="7" y="7" width="5" height="5" rx="1"/>
    </svg>
  );
}

function ProjectsIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M0.999512 10C0.999512 11.103 1.89651 12 2.99951 12H8.99951C10.1025 12 10.9995 11.103 10.9995 10V3C10.9995 1.897 10.1025 1 8.99951 1H7.99951C7.99951 0.4485 7.55051 0 6.99951 0H4.99951C4.44801 0 3.99951 0.4485 3.99951 1H2.99951C1.89651 1 0.999512 1.897 0.999512 3V10ZM4.99951 1H6.99951V2H4.99951V1ZM1.99951 3C1.99951 2.4485 2.44801 2 2.99951 2H3.99951C3.99951 2.5515 4.44801 3 4.99951 3H6.99951C7.55051 3 7.99951 2.5515 7.99951 2H8.99951C9.55101 2 9.99951 2.4485 9.99951 3V10C9.99951 10.5515 9.55101 11 8.99951 11H2.99951C2.44801 11 1.99951 10.5515 1.99951 10V3ZM5.74951 5.5C5.74951 5.36739 5.80219 5.24021 5.89596 5.14645C5.98973 5.05268 6.1169 5 6.24951 5H7.99951C8.13212 5 8.2593 5.05268 8.35307 5.14645C8.44683 5.24021 8.49951 5.36739 8.49951 5.5C8.49951 5.63261 8.44683 5.75979 8.35307 5.85355C8.2593 5.94732 8.13212 6 7.99951 6H6.24951C6.1169 6 5.98973 5.94732 5.89596 5.85355C5.80219 5.75979 5.74951 5.63261 5.74951 5.5ZM5.74951 7.5C5.74951 7.36739 5.80219 7.24021 5.89596 7.14645C5.98973 7.05268 6.1169 7 6.24951 7H7.99951C8.13212 7 8.2593 7.05268 8.35307 7.14645C8.44683 7.24021 8.49951 7.36739 8.49951 7.5C8.49951 7.63261 8.44683 7.75979 8.35307 7.85355C8.2593 7.94732 8.13212 8 7.99951 8H6.24951C6.1169 8 5.98973 7.94732 5.89596 7.85355C5.80219 7.75979 5.74951 7.63261 5.74951 7.5ZM3.49951 5.5C3.49951 5.22386 3.72337 5 3.99951 5C4.27566 5 4.49951 5.22386 4.49951 5.5C4.49951 5.77614 4.27566 6 3.99951 6C3.72337 6 3.49951 5.77614 3.49951 5.5ZM3.49951 7.5C3.49951 7.22386 3.72337 7 3.99951 7C4.27566 7 4.49951 7.22386 4.49951 7.5C4.49951 7.77614 4.27566 8 3.99951 8C3.72337 8 3.49951 7.77614 3.49951 7.5Z" fill="currentColor"/>
    </svg>
  );
}

function WorkloadIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M8.5 0.494141C7.5485 0.494141 6.6525 0.877145 6 1.54215C5.3475 0.877145 4.4515 0.494141 3.5 0.494141C1.5705 0.494141 0 2.05914 0 3.98264C0 7.55215 5.4665 11.7182 5.6985 11.8932C5.788 11.9607 5.894 11.9942 6 11.9942C6.106 11.9942 6.212 11.9607 6.3015 11.8932C6.534 11.7177 12 7.55165 12 3.98264C12 2.05914 10.4295 0.494141 8.5 0.494141ZM6 10.8572C4.8765 9.94915 1 6.62365 1 3.98264C1 2.63414 2.145 1.49414 3.5 1.49414C4.34 1.49414 5.1185 1.91115 5.584 2.60915C5.7695 2.88765 6.2305 2.88765 6.416 2.60915C6.8815 1.91115 7.66 1.49414 8.5 1.49414C9.855 1.49414 11 2.63364 11 3.98264C11 6.62365 7.1235 9.94915 6 10.8572ZM9.5 5.74415C9.5 6.02065 9.2765 6.24415 9 6.24415H8.207L6.8535 7.59765C6.7595 7.69215 6.6315 7.74415 6.5 7.74415C6.4735 7.74415 6.447 7.74215 6.42 7.73765C6.2615 7.71165 6.1245 7.61115 6.053 7.46765L5.191 5.74415L4.938 5.23815L4.601 5.74415L4.416 6.02165C4.323 6.16065 4.167 6.24415 4 6.24415H3C2.7235 6.24415 2.5 6.02065 2.5 5.74415C2.5 5.46765 2.7235 5.24415 3 5.24415H3.7325L4.584 3.96665C4.683 3.81815 4.8445 3.73415 5.0315 3.74515C5.209 3.75615 5.368 3.86115 5.4475 4.02065L6.3095 5.74415L6.6375 6.40015L7.2935 5.74415L7.647 5.39065C7.741 5.29665 7.8675 5.24415 8.0005 5.24415H9.0005C9.277 5.24415 9.5 5.46765 9.5 5.74415Z" fill="currentColor"/>
    </svg>
  );
}

function EscalationIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M1.49902 11.9995C1.63163 11.9995 1.75881 11.9468 1.85258 11.8531C1.94634 11.7593 1.99902 11.6321 1.99902 11.4995V6.952C3.25202 6.504 4.53452 6.7865 5.88752 7.0935C6.77502 7.295 7.67952 7.5005 8.59952 7.5005C9.29302 7.5005 9.99552 7.384 10.706 7.0605C10.884 6.9795 10.999 6.8005 10.999 6.6055V1.4995C10.999 1.41584 10.978 1.33353 10.9379 1.26009C10.8978 1.18666 10.84 1.12446 10.7696 1.07918C10.6993 1.03391 10.6187 1.00701 10.5352 1.00095C10.4518 0.994892 10.3682 1.00987 10.292 1.0445C8.94952 1.655 7.57402 1.318 6.11802 0.961C4.78202 0.634 3.40852 0.302 1.99902 0.688V0.5C1.99902 0.367392 1.94634 0.240215 1.85258 0.146447C1.75881 0.0526784 1.63163 0 1.49902 0C1.36642 0 1.23924 0.0526784 1.14547 0.146447C1.0517 0.240215 0.999023 0.367392 0.999023 0.5V11.5C0.999023 11.7765 1.22252 11.9995 1.49902 11.9995ZM1.99902 1.7305C3.24952 1.2865 4.53002 1.601 5.88002 1.932C7.21552 2.2595 8.59052 2.5955 9.99902 2.211V6.269C8.74602 6.718 7.46252 6.4255 6.11002 6.118C5.22252 5.916 4.31802 5.7105 3.39752 5.7105C2.93552 5.7105 2.46952 5.7625 1.99902 5.893V1.7305Z" fill="currentColor"/>
    </svg>
  );
}

function ApprovalsIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M1.23648 8.3545C1.14248 8.46537 1.07386 8.59545 1.03543 8.73563C0.996991 8.87581 0.989672 9.02269 1.01398 9.166L1.25248 10.583C1.27212 10.6997 1.33248 10.8056 1.42283 10.8819C1.51319 10.9583 1.62769 11.0001 1.74598 11H10.2535C10.3718 11.0001 10.4863 10.9583 10.5766 10.8819C10.667 10.8056 10.7273 10.6997 10.747 10.583L10.9855 9.1665C11.0099 9.02312 11.0026 8.87612 10.9642 8.73585C10.9258 8.59557 10.8571 8.46541 10.763 8.3545C10.6691 8.24323 10.552 8.15384 10.42 8.0926C10.2879 8.03136 10.1441 7.99976 9.99848 8H7.69148L8.44748 4.099C8.58498 3.3905 8.46348 2.6985 8.10548 2.152C7.63298 1.4305 6.84548 1 5.99898 1C5.15248 1 4.36498 1.4305 3.89248 2.152C3.53498 2.6985 3.41348 3.3905 3.55048 4.099L4.30648 8H1.99948C1.85393 7.99989 1.71011 8.03156 1.57807 8.09279C1.44602 8.15402 1.32893 8.24333 1.23498 8.3545H1.23648ZM4.73098 2.6995C5.01798 2.2615 5.49198 2 5.99948 2C6.50698 2 6.98148 2.2615 7.26798 2.6995C7.47948 3.0225 7.55098 3.4635 7.46448 3.909L6.67148 8H5.32648L4.53348 3.909C4.44698 3.463 4.51898 3.0225 4.72998 2.6995H4.73098ZM9.99848 9L9.82998 10H2.16898L2.00048 9H9.99848Z" fill="currentColor"/>
    </svg>
  );
}

function MyQueueIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M6 7C7.9295 7 9.5 5.43 9.5 3.5C9.5 1.57 7.9295 0 6 0C4.0705 0 2.5 1.57 2.5 3.5C2.5 5.43 4.0705 7 6 7ZM6 1C7.3785 1 8.5 2.121 8.5 3.5C8.5 4.878 7.3785 6 6 6C4.6215 6 3.5 4.878 3.5 3.5C3.5 2.121 4.6215 1 6 1ZM3.5 8H8.5C9.8785 8 11 9.121 11 10.5V11.5C11 11.6326 10.9473 11.7598 10.8536 11.8536C10.7598 11.9473 10.6326 12 10.5 12C10.3674 12 10.2402 11.9473 10.1464 11.8536C10.0527 11.7598 10 11.6326 10 11.5V10.5C10 9.6725 9.327 9 8.5 9H3.5C2.673 9 2 9.6725 2 10.5V11.5C2 11.6326 1.94732 11.7598 1.85355 11.8536C1.75979 11.9473 1.63261 12 1.5 12C1.36739 12 1.24021 11.9473 1.14645 11.8536C1.05268 11.7598 1 11.6326 1 11.5V10.5C1 9.121 2.1215 8 3.5 8Z" fill="currentColor"/>
    </svg>
  );
}

function FollowingIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M6.00001 9.99999C8.54951 9.99999 10.8295 8.55049 11.9505 6.21649C11.9831 6.14906 12 6.07513 12 6.00024C12 5.92534 11.9831 5.85142 11.9505 5.78399C10.8295 3.44999 8.54901 2.00049 6.00001 2.00049C3.45101 2.00049 1.17051 3.44949 0.0495126 5.78349C0.0169258 5.85092 0 5.92485 0 5.99974C0 6.07463 0.0169258 6.14856 0.0495126 6.21599C1.17051 8.54999 3.45101 9.99999 6.00001 9.99999ZM6.00001 2.99999C8.08151 2.99999 9.95301 4.14349 10.94 5.99999C9.95301 7.85649 8.08151 8.99999 6.00001 8.99999C3.91851 8.99999 2.04701 7.85649 1.06001 5.99999C2.04701 4.14349 3.91851 2.99999 6.00001 2.99999ZM6.00001 7.99999C7.10301 7.99999 8.00001 7.10299 8.00001 5.99999C8.00001 4.89699 7.10301 3.99999 6.00001 3.99999C4.89701 3.99999 4.00001 4.89699 4.00001 5.99999C4.00001 7.10299 4.89701 7.99999 6.00001 7.99999ZM6.00001 4.99999C6.55151 4.99999 7.00001 5.44849 7.00001 5.99999C7.00001 6.55149 6.55151 6.99999 6.00001 6.99999C5.44851 6.99999 5.00001 6.55149 5.00001 5.99999C5.00001 5.44849 5.44851 4.99999 6.00001 4.99999Z" fill="currentColor"/>
    </svg>
  );
}

function UnassignedIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M2.5 1H1.5C0.673 1 0 1.673 0 2.5V3.5C0 4.327 0.673 5 1.5 5H2.5C3.327 5 4 4.327 4 3.5V2.5C4 1.673 3.327 1 2.5 1ZM3 3.5C3 3.7755 2.776 4 2.5 4H1.5C1.224 4 1 3.7755 1 3.5V2.5C1 2.2245 1.224 2 1.5 2H2.5C2.776 2 3 2.2245 3 2.5V3.5ZM2.5 7H1.5C0.673 7 0 7.673 0 8.5V9.5C0 10.327 0.673 11 1.5 11H2.5C3.327 11 4 10.327 4 9.5V8.5C4 7.673 3.327 7 2.5 7ZM3 9.5C3 9.7755 2.776 10 2.5 10H1.5C1.224 10 1 9.7755 1 9.5V8.5C1 8.2245 1.224 8 1.5 8H2.5C2.776 8 3 8.2245 3 8.5V9.5ZM5 3C5 2.86739 5.05268 2.74021 5.14645 2.64645C5.24021 2.55268 5.36739 2.5 5.5 2.5H11.5C11.6326 2.5 11.7598 2.55268 11.8536 2.64645C11.9473 2.74021 12 2.86739 12 3C12 3.13261 11.9473 3.25979 11.8536 3.35355C11.7598 3.44732 11.6326 3.5 11.5 3.5H5.5C5.36739 3.5 5.24021 3.44732 5.14645 3.35355C5.05268 3.25979 5 3.13261 5 3ZM12 9C12 9.13261 11.9473 9.25979 11.8536 9.35355C11.7598 9.44732 11.6326 9.5 11.5 9.5H5.5C5.36739 9.5 5.24021 9.44732 5.14645 9.35355C5.05268 9.25979 5 9.13261 5 9C5 8.86739 5.05268 8.74021 5.14645 8.64645C5.24021 8.55268 5.36739 8.5 5.5 8.5H11.5C11.6326 8.5 11.7598 8.55268 11.8536 8.64645C11.9473 8.74021 12 8.86739 12 9Z" fill="currentColor"/>
    </svg>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function ChevronRightIcon({ expanded }) {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" aria-hidden="true"
      style={{ transition: 'transform 0.15s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <path d="M5.0735 1.94248C5.01073 1.86536 4.93326 1.80149 4.84558 1.75458C4.75791 1.70768 4.66178 1.67867 4.56279 1.66926C4.4638 1.65985 4.36393 1.67021 4.26898 1.69975C4.17404 1.72929 4.08591 1.77742 4.00974 1.84133C3.93356 1.90524 3.87085 1.98366 3.82526 2.07203C3.77968 2.1604 3.75211 2.25695 3.74418 2.35607C3.73625 2.45518 3.74811 2.55489 3.77906 2.64938C3.81002 2.74388 3.85946 2.83127 3.9245 2.90648L6.52 5.99948L3.9245 9.09248C3.83257 9.20175 3.77378 9.335 3.75503 9.47656C3.73627 9.61812 3.75835 9.76208 3.81865 9.89151C3.87896 10.0209 3.97498 10.1305 4.09542 10.2072C4.21586 10.2839 4.35571 10.3246 4.4985 10.3245C4.7125 10.3245 4.9255 10.2335 5.0735 10.0565L8.0735 6.48148C8.18692 6.34639 8.2491 6.17563 8.2491 5.99923C8.2491 5.82284 8.18692 5.65208 8.0735 5.51698L5.0735 1.94248Z" fill="currentColor"/>
    </svg>
  );
}


function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true">
      <path d="M15.7915 0.0943573C15.7272 0.0481295 15.6528 0.017779 15.5745 0.00578665C15.4962 -0.00620568 15.4162 0.000500612 15.341 0.0253573L6.418 2.99986H2C0.897 2.99986 0 3.89686 0 4.99986V8.99986C0 10.1029 0.897 10.9999 2 10.9999H2.109L3.3065 15.2699C3.3659 15.4796 3.49195 15.6642 3.6656 15.7959C3.83925 15.9276 4.05106 15.9992 4.269 15.9999H6C6.5515 15.9999 7 15.5514 7 14.9999V11.1939L15.342 13.9744C15.4172 13.9996 15.4973 14.0066 15.5757 13.9947C15.6541 13.9829 15.7285 13.9525 15.7929 13.9061C15.8572 13.8597 15.9095 13.7987 15.9456 13.728C15.9816 13.6574 16.0002 13.5792 16 13.4999V0.499857C16 0.420664 15.9812 0.342605 15.9451 0.272106C15.909 0.201607 15.8567 0.140685 15.7925 0.0943573H15.7915ZM5.999 14.9999H4.268L3.1465 10.9999H5.999V14.9999ZM5.999 9.99986H1.999C1.4475 9.99986 0.999 9.55136 0.999 8.99986V4.99986C0.999 4.44836 1.4475 3.99986 1.999 3.99986H5.999V9.99986ZM14.999 12.8064L6.999 10.1399V3.86036L14.999 1.19386V12.8064Z" fill="#9187EB"/>
    </svg>
  );
}

// ── Shared nav primitives ──────────────────────────────────────────────────────

function SectionLabel({ label, onAdd }) {
  return (
    <div className="px-4 pt-3 pb-0.5 flex items-center justify-between">
      <span className="text-[11px] font-medium text-text-disabled">{label}</span>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${label}`}
          className="w-4 h-4 flex items-center justify-center rounded
                     text-text-disabled hover:text-text hover:bg-[var(--background-hover)]
                     border-0 bg-transparent cursor-pointer transition-colors duration-100"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
            <path d="M7.99899 2C7.73378 2 7.47942 2.10536 7.29189 2.29289C7.10435 2.48043 6.99899 2.73478 6.99899 3V7H2.99899C2.73378 7 2.47942 7.10536 2.29189 7.29289C2.10435 7.48043 1.99899 7.73478 1.99899 8C1.99899 8.26522 2.10435 8.51957 2.29189 8.70711C2.47942 8.89464 2.73378 9 2.99899 9H6.99899V13C6.99899 13.2652 7.10435 13.5196 7.29189 13.7071C7.47942 13.8946 7.73378 14 7.99899 14C8.26421 14 8.51856 13.8946 8.7061 13.7071C8.89364 13.5196 8.99899 13.2652 8.99899 13V9H12.999C13.2642 9 13.5186 8.89464 13.7061 8.70711C13.8936 8.51957 13.999 8.26522 13.999 8C13.999 7.73478 13.8936 7.48043 13.7061 7.29289C13.5186 7.10536 13.2642 7 12.999 7H8.99899V3C8.99899 2.73478 8.89364 2.48043 8.7061 2.29289C8.51856 2.10536 8.26421 2 7.99899 2Z" fill="currentColor"/>
          </svg>
        </button>
      )}
    </div>
  );
}

function NavItem({ label, Icon, badge, active, onClick }) {
  return (
    <div className="px-2 py-[2px]">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={[
          'w-full flex items-center gap-2.5 px-2 h-8',
          'text-left text-[14px] leading-5 whitespace-nowrap overflow-hidden cursor-pointer border-0',
          'rounded-[8px] transition-colors duration-100',
          active ? 'bg-[var(--background-active)] text-text font-medium' : 'bg-transparent text-text-weak',
          'hover:bg-[var(--background-hover)] hover:text-text',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
        ].join(' ')}
      >
        <Icon className="w-4 h-4 shrink-0 text-icon" />
        <span className="flex-1 truncate">{label}</span>
        {badge != null && (
          <span className="text-[11px] font-medium text-text-disabled tabular-nums">{badge}</span>
        )}
      </button>
    </div>
  );
}

function ExpandableNavItem({ label, Icon, badge, active, expanded, onToggle, children }) {
  return (
    <div>
      <div className="px-2 py-[2px]">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={[
            'w-full flex items-center gap-2.5 px-2 h-8',
            'text-left text-[14px] leading-5 whitespace-nowrap overflow-hidden cursor-pointer border-0',
            'rounded-[8px] transition-colors duration-100',
            active ? 'bg-[var(--background-active)] text-text font-medium' : 'bg-transparent text-text-weak',
            'hover:bg-[var(--background-hover)] hover:text-text',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
          ].join(' ')}
        >
          <Icon className="w-4 h-4 shrink-0 text-icon" />
          <span className="flex-1 truncate">{label}</span>
          {badge != null && (
            <span className="text-[11px] font-medium text-text-disabled tabular-nums mr-1">{badge}</span>
          )}
          <ChevronRightIcon expanded={expanded} />
        </button>
      </div>
      {expanded && <div>{children}</div>}
    </div>
  );
}


function QueueSubItem({ label, badge, active, onClick }) {
  return (
    <div className="px-2 py-[2px]">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={[
          'w-full flex items-center gap-2 h-7',
          'text-left text-[13px] leading-5 whitespace-nowrap overflow-hidden cursor-pointer border-0',
          'rounded-[8px] transition-colors duration-100',
          active ? 'bg-[var(--background-active)] text-text font-medium' : 'bg-transparent text-text-weak',
          'hover:bg-[var(--background-hover)] hover:text-text',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
        ].join(' ')}
        style={{ paddingLeft: 28 }}
      >
        <span className="flex-1 truncate">{label}</span>
        {badge != null && (
          <span className="text-[11px] font-medium text-text-disabled tabular-nums">{badge}</span>
        )}
      </button>
    </div>
  );
}

// ── Nav content per role ───────────────────────────────────────────────────────

function Agent2NavContent({ activeItem, onSelect }) {
  const NAV_SECTIONS = [
    [{ label: 'Inbox', Icon: InboxIcon, badge: 4 }],
    [
      { label: 'IT Tickets', Icon: TicketsIcon, badge: 3 },
      { label: 'HR Tickets', Icon: TicketsIcon, badge: 1 },
    ],
    [
      { label: 'Dashboard', Icon: DashboardIcon },
      { label: 'Optimize',  Icon: OptimizeIcon  },
      { label: 'Assets',    Icon: AssetsIcon, badge: 5 },
    ],
  ];

  return (
    <>
      {NAV_SECTIONS.map((items, si) => (
        <div key={si}>
          {si > 0 && <hr className="my-1 border-border" />}
          {items.map(({ label, Icon, badge }) => (
            <NavItem key={label} label={label} Icon={Icon} badge={badge}
              active={activeItem === label} onClick={() => onSelect(label)} />
          ))}
        </div>
      ))}
      <hr className="my-1 border-border" />
      <NavItem label="Knowledge" Icon={LightBulbIcon}
        active={activeItem === 'Knowledge base'} onClick={() => onSelect('Knowledge base')} />
      {[{ label: 'Automations', Icon: AutomationIcon }, { label: 'Settings', Icon: SettingsIcon }].map(({ label, Icon }) => (
        <NavItem key={label} label={label} Icon={Icon}
          active={activeItem === label} onClick={() => onSelect(label)} />
      ))}
    </>
  );
}

function AdminNavContent({ activeItem, onSelect }) {
  return (
    <>
      <SectionLabel label="Queues" onAdd={() => onSelect('Create Queue')} />
      <NavItem label="IT Tickets" Icon={TicketsIcon} badge={3} active={activeItem === 'IT Tickets'} onClick={() => onSelect('IT Tickets')} />
      <NavItem label="HR Tickets" Icon={TicketsIcon} badge={1} active={activeItem === 'HR Tickets'} onClick={() => onSelect('HR Tickets')} />

      <SectionLabel label="Insights" />
      <NavItem label="Dashboard" Icon={DashboardIcon} active={activeItem === 'Dashboard'} onClick={() => onSelect('Dashboard')} />
      <NavItem label="Optimize" Icon={OptimizeIcon} active={activeItem === 'Optimize V2' || activeItem === 'Optimize'} onClick={() => onSelect('Optimize V2')} />

      <SectionLabel label="Resources" />
      <NavItem label="Knowledge" Icon={LightBulbIcon}
        active={activeItem === 'Knowledge base'} onClick={() => onSelect('Knowledge base')} />
      <NavItem label="Assets" Icon={AssetsIcon} badge={5} active={activeItem === 'Assets'} onClick={() => onSelect('Assets')} />

      <SectionLabel label="Configure" />
      <NavItem label="Automations" Icon={AutomationIcon} active={activeItem === 'Automations'} onClick={() => onSelect('Automations')} />
      <NavItem label="Settings" Icon={SettingsIcon} active={activeItem === 'Settings'} onClick={() => onSelect('Settings')} />
    </>
  );
}

// ── Agent: workbench model ─────────────────────────────────────────────────────
function AgentNavContent({ activeItem, onSelect }) {
  return (
    <>
      <NavItem label="My Tickets" Icon={MyQueueIcon} badge={5} active={activeItem === 'My Tickets'} onClick={() => onSelect('My Tickets')} />
      <NavItem label="My performance" Icon={WorkloadIcon} active={activeItem === 'My Performance'} onClick={() => onSelect('My Performance')} />
      <NavItem label="Collaborating" Icon={FollowingIcon} badge={2} active={activeItem === 'Collaborating'} onClick={() => onSelect('Collaborating')} />

      <SectionLabel label="Queues" />
      <NavItem label="IT Support" Icon={TicketsIcon} badge={12} active={activeItem === 'IT Tickets' || activeItem === 'IT Unassigned' || activeItem === 'IT All Active'} onClick={() => onSelect('IT Tickets')} />
      <NavItem label="HR" Icon={TicketsIcon} badge={9} active={activeItem === 'HR Tickets' || activeItem === 'HR Unassigned' || activeItem === 'HR All Active'} onClick={() => onSelect('HR Tickets')} />

      <SectionLabel label="Reference" />
      <NavItem label="Knowledge" Icon={LightBulbIcon}
        active={activeItem === 'Knowledge base'} onClick={() => onSelect('Knowledge base')} />
      <NavItem label="Assets" Icon={AssetsIcon} active={activeItem === 'Assets'} onClick={() => onSelect('Assets')} />
    </>
  );
}

// ── Agent 3: home-first model ──────────────────────────────────────────────────
function Agent3NavContent({ activeItem, onSelect }) {
  return (
    <>
      <NavItem label="Overview" Icon={OverviewIcon} active={activeItem === 'Agent Home' || activeItem === 'Home'} onClick={() => onSelect('Agent Home')} />

      <NavItem label="My Tickets" Icon={MyQueueIcon} badge={5} active={activeItem === 'My Tickets'} onClick={() => onSelect('My Tickets')} />
      <NavItem label="Collaborating" Icon={FollowingIcon} badge={2} active={activeItem === 'Collaborating' || activeItem === 'Following'} onClick={() => onSelect('Collaborating')} />

      <SectionLabel label="Team" />
      <NavItem label="Unassigned" Icon={UnassignedIcon} badge={8} active={activeItem === 'Unassigned'} onClick={() => onSelect('Unassigned')} />
      <NavItem label="All tickets" Icon={TicketsIcon} badge={20} active={activeItem === 'All Tickets'} onClick={() => onSelect('All Tickets')} />

      <SectionLabel label="Reference" />
      <NavItem label="Knowledge" Icon={LightBulbIcon}
        active={activeItem === 'Knowledge base'} onClick={() => onSelect('Knowledge base')} />
      <NavItem label="Assets" Icon={AssetsIcon} active={activeItem === 'Assets'} onClick={() => onSelect('Assets')} />
    </>
  );
}

// ── Admin 2: command center model ─────────────────────────────────────────────
function Admin2NavContent({ activeItem, onSelect }) {
  return (
    <>
      <NavItem label="Overview" Icon={ProjectsIcon} active={activeItem === 'Home'} onClick={() => onSelect('Home')} />

      <SectionLabel label="Triage" />
      <NavItem label="Escalations" Icon={EscalationIcon} badge={3} active={activeItem === 'Escalations'} onClick={() => onSelect('Escalations')} />
      <NavItem label="My Tickets" Icon={MyQueueIcon} badge={4} active={activeItem === 'My Tickets'} onClick={() => onSelect('My Tickets')} />
      <NavItem label="IT Support" Icon={TicketsIcon} badge={12} active={activeItem === 'IT Tickets'} onClick={() => onSelect('IT Tickets')} />
      <NavItem label="HR"         Icon={TicketsIcon} badge={9}  active={activeItem === 'HR Tickets'} onClick={() => onSelect('HR Tickets')} />
      <NavItem label="Conversations" Icon={InboxIcon} badge={24} active={activeItem === 'Requests'} onClick={() => onSelect('Requests')} />

      <SectionLabel label="Insights" />
      <NavItem label="Dashboard"  Icon={DashboardIcon}   active={activeItem === 'Dashboard'}  onClick={() => onSelect('Dashboard')} />
<NavItem label="Optimize" Icon={OptimizeIcon} active={activeItem === 'Optimize V2' || activeItem === 'Optimize'} onClick={() => onSelect('Optimize V2')} />

      <SectionLabel label="Resources" />
      <NavItem label="Automations" Icon={AutomationIcon} active={activeItem === 'Automations'} onClick={() => onSelect('Automations')} />
      <NavItem label="Knowledge" Icon={LightBulbIcon}
        active={activeItem === 'Knowledge base'} onClick={() => onSelect('Knowledge base')} />
      <NavItem label="Assets" Icon={AssetsIcon} active={activeItem === 'Assets'} onClick={() => onSelect('Assets')} />
      <NavItem label="Settings" Icon={SettingsIcon} active={activeItem === 'Settings'} onClick={() => onSelect('Settings')} />
    </>
  );
}

// ── ServiceSecondaryNav ────────────────────────────────────────────────────────

export default function ServiceSecondaryNav({ activeItem, onSelect, role }) {
  const sharedProps = { activeItem, onSelect };

  return (
    <aside
      className="flex flex-col w-[182px] h-full bg-background-medium shrink-0"
      style={{ borderTopLeftRadius: 10, borderRight: '1px solid var(--border)', overflow: 'hidden' }}
      aria-label="Service navigation"
    >
      <nav className="flex-1 overflow-y-auto py-2">
        {role === 'agent'   ? <AgentNavContent   {...sharedProps} /> :
         role === 'agent3'  ? <Agent3NavContent  {...sharedProps} /> :
         role === 'admin'   ? <AdminNavContent   {...sharedProps} /> :
         role === 'admin2'  ? <Admin2NavContent  {...sharedProps} /> :
                              <Agent2NavContent  {...sharedProps} />}
      </nav>

      <div className="p-3 border-t border-border flex flex-col gap-2">
        {/* Create queue button — only for agent2 (admin/admin2 have inline +, others don't create queues) */}
        {(!role || role === 'agent2') && (
          <button
            type="button"
            onClick={() => onSelect('Create Queue')}
            className="flex items-center justify-center gap-1.5 w-full h-8 rounded-lg
                       bg-background-weak border border-border text-text text-xs font-normal
                       hover:bg-background-medium hover:border-border-strong transition-colors duration-150 cursor-pointer"
          >
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="#1E1F21" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Create queue
          </button>
        )}
        <button
          type="button"
          className="flex items-center gap-1.5 w-full px-2 py-1
                     text-[12px] font-medium text-text-disabled
                     hover:text-text-weak transition-colors duration-150 cursor-pointer
                     border-0 bg-transparent"
        >
          <MegaphoneIcon />
          Give feedback
        </button>
      </div>
    </aside>
  );
}
