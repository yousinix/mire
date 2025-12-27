<script lang="ts">
  import type { BaseProps } from './BaseProps';

  interface Props extends BaseProps {}

  let props: Props = $props();
</script>

<div class={['rounded-lg border border-neutral-700 bg-neutral-900', props.class]}>
  {@render props.children()}
</div>
