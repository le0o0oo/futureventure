<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <svg
    :class="props.class"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 300 300"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    project-id="476f6034fe914ee996a89d4e13de823e"
    export-id="a54dfb76a58d497db04da0a63d52cee8"
    cached="false"
  >
    <rect
      width="48"
      height="48"
      rx="6.22"
      ry="6.22"
      transform="matrix(4.41158 0 0 3.319643 44.12208 0)"
      fill="#e1dfdf"
    />
    <rect
      width="48"
      height="48"
      rx="6.22"
      ry="6.22"
      transform="matrix(3.471619 0 0 2.612346 66.681144 17.526074)"
      fill="#ef7ef4"
    />
    <g transform="translate(-.000007-17.408896)">
      <circle
        r="27.5"
        transform="translate(110.513091 79.497362)"
        fill="#fff"
      />
      <circle
        r="27.5"
        transform="translate(189.849365 79.497362)"
        fill="#fff"
      />
      <rect
        width="46"
        height="46"
        rx="0"
        ry="0"
        transform="matrix(3.449403 0 0 1 70.663731 74.080328)"
        fill="#ef7ef4"
      />
      <circle
        r="27.5"
        transform="matrix(.779984 0 0 0.779984 110.513091 79.497362)"
        fill="#ef7ef4"
      />
      <circle
        r="27.5"
        transform="matrix(.779984 0 0 0.779984 189.849365 79.497362)"
        fill="#ef7ef4"
      />
    </g>
    <path
      d="M34,20.6c17.673112,0,32,14.326888,32,32s-14.326888,32-32,32Z"
      transform="matrix(0 0.721397-.574993 0 180.244632 78.868415)"
      fill="#fff"
    />
    <circle
      r="27.5"
      transform="matrix(.898411 0.439155-.992572 2.030578 263.300964 169.367756)"
      fill="#e1dfdf"
    />
    <circle
      r="27.5"
      transform="matrix(.898411-.439155-.992573-2.030577 37.061455 169.367757)"
      fill="#e1dfdf"
    />
    <rect
      width="46"
      height="46"
      rx="0"
      ry="0"
      transform="matrix(.20729 0 0 0.472799 145.232323 153.381504)"
      fill="#e1dfdf"
    />
    <rect
      width="46"
      height="46"
      rx="0"
      ry="0"
      transform="matrix(2.27275 0 0 1.388892 97.72674 173.396368)"
      fill="#e1dfdf"
    />
    <polygon
      points="50,23.15 19,76.85 81,76.85 50,23.15"
      transform="matrix(-1.686234 0 0-1.004971 234.311686 314.517421)"
      fill="#e1dfdf"
    />
  </svg>
</template>
