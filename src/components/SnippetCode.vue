<script lang="ts">
import {
  defineComponent, Fragment, h, type PropType
} from 'vue';

type SnippetToken = {
  class?: string;
  value: string;
};

type SnippetLine = SnippetToken[];

export default defineComponent({
  name: 'SnippetCode',
  props: {
    lines: {
      type: Array as PropType<SnippetLine[]>,
      required: true
    }
  },
  setup(props) {
    return () => h(Fragment, null, props.lines.flatMap((line, lineIndex) => {
      const lineNodes = line.map((token, tokenIndex) => h(
        'span',
        {
          key: `${lineIndex}-${tokenIndex}`,
          class: token.class
        },
        token.value
      ));

      if (lineIndex === props.lines.length - 1) {
        return [h('span', { class: 'preview-panel__snippet-line' }, lineNodes)];
      }

      return [
        h('span', { class: 'preview-panel__snippet-line' }, lineNodes),
        h('br')
      ];
    }));
  }
});
</script>
