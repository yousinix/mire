<script lang="ts">
  import type { BaseProps } from './BaseProps';

  interface Props extends Pick<BaseProps, 'class'> {
    size: number;
  }

  let props: Props = $props();
</script>

<svg aria-hidden="true" class={['absolute inset-0 h-full w-full', props.class]}>
  <defs>
    <pattern
      id="grid"
      width={props.size}
      height={props.size}
      patternUnits="userSpaceOnUse"
      x={-1}
      y={-1}
    >
      <path d="M.5 {props.size}V.5H{props.size}" fill="none" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" stroke-width={0} fill="url(#grid)" />
  <svg class="overflow-visible">
    <rect fill="none" stroke-width="0" width={props.size - 1} height={props.size - 1} x={1} y={1} />
  </svg>
</svg>
