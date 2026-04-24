/**
 * KF brand monogram — vector paths extracted from the traced brand logo.
 * Uses currentColor, so it adapts to any background via text-* classes.
 *
 * To revert to the old "KF" text logo:
 *   Navbar: restore the <svg><text>KF</text></svg> block
 *   Footer: restore the <span>KF</span> inside the logo box
 */

interface KFLogoProps {
  /** size in px — applied to both width and height (SVG scales proportionally) */
  size?: number;
  className?: string;
}

/* KF letterform path — extracted from brand logo (imagetracer trace of official PNG).
   ViewBox covers just the monogram mark: x 242–758, y 236–768               */
const PATH =
  'M 444.5 242 L 479 242.5 L 474 249.5 L 473 261.5 L 472 262.5 L 472 423.5 L 478 418.5 L 604 266.5 L 611 254.5 L 612 242 L 639 242.5 Q 618.8 251.3 606 267.5 L 541 347.5 L 594.5 441 Q 613.1 409.1 638.5 384 Q 648 376 661.5 372 L 670.5 370 L 690.5 370 L 703.5 373 L 717.5 380 L 729 389 L 739 402.5 L 745 415.5 L 748 428.5 L 748 445.5 Q 743.2 472.2 726.5 487 Q 716.1 497.1 700.5 502 L 691.5 504 L 670.5 504 L 662 502 L 663.5 499 L 669.5 501 L 684.5 502 L 705.5 497 Q 718.1 491.6 727 482.5 Q 737.9 471.9 743 455.5 L 745 446.5 L 745 427.5 L 740 410.5 L 727 391 L 716.5 383 L 705.5 377 L 691.5 373 L 681.5 373 L 680.5 372 L 658.5 376 Q 641.7 382.7 631 395.5 L 606 428.5 L 596 443.5 L 596 445.5 L 620 486.5 L 634.5 502 L 637 503.5 L 622 504.5 L 628 529.5 L 626 528.5 L 623.5 525 Q 613.1 516.4 598.5 512 L 576.5 507 L 556.5 505 Q 532.4 541.4 501.5 571 L 486 584.5 L 486 607 L 520.5 607 L 536.5 603 Q 546.1 599.1 552 591.5 L 552.5 590 L 553 629.5 L 550 627.5 L 548.5 625 L 535.5 617 L 524.5 614 Q 518.3 615.8 516.5 613 L 486 613 L 486 745.5 L 492 760 L 457 759.5 L 461 753.5 L 464 739.5 L 464 602.5 L 462.5 603 L 442.5 614 L 413.5 623 L 401.5 624 L 400.5 625 L 371.5 625 L 370.5 624 L 358.5 623 L 340.5 618 L 320.5 609 Q 297.5 596 281 576.5 Q 263.1 555.4 254 525.5 L 250 506.5 L 250 468.5 Q 260.6 412.6 297.5 383 Q 315.6 367.1 340.5 358 L 363.5 352 L 388.5 351 L 396 356.5 L 398 364.5 L 393.5 372 Q 390.8 374.8 384.5 374 L 379 370.5 Q 376 367.5 376 361.5 L 380 354.5 L 376.5 354 L 349.5 359 Q 333.5 363.5 320.5 371 Q 299.5 383.5 284 401.5 Q 266 422.5 257 452.5 L 253 473.5 L 253 501.5 L 258 526.5 L 270 554.5 Q 282.7 576.3 301.5 592 Q 321.3 608.2 348.5 617 L 375.5 622 L 399.5 622 L 400.5 621 L 418.5 619 L 431.5 615 Q 450.6 608.6 464 596.5 L 464 516.5 L 462 505.5 L 460.5 504 L 443 503.5 L 447 499.5 L 450 489.5 L 450 254.5 Q 448.5 246.1 444.5 242 Z M 529 362 L 472 430 L 472 482 L 475 497 L 477 498 L 557 498 L 582 461 L 578 451 L 529 362 Z M 583 463 L 562 497 L 563 498 L 602 498 L 601 493 L 596 483 L 585 465 Q 586 462 583 463 Z M 506 504 L 505 505 L 489 505 L 486 511 L 487 580 L 492 576 Q 526 545 552 506 L 535 505 L 534 504 L 508 504 L 506 504 Z';

export default function KFLogo({ size = 36, className }: KFLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="242 236 516 532"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      shapeRendering="geometricPrecision"
    >
      <path d={PATH} />
    </svg>
  );
}
