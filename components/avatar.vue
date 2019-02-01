<template>
  <svg height="32" width="32" viewBox="0 0 160 160">
    <g>
      <circle v-for="(value, index) in sortedValues"
        :cx="cx"
        :cy="cy"
        :r="radius"
        fill="transparent"
        :stroke="rng.colorHSL()"
        :stroke-width="strokeWidth"
        :stroke-dasharray="adjustedCircumference"
        :stroke-dashoffset="calculateStrokeDashOffset(value, circumference)"
        :transform="returnCircleTransformValue(index)"
        shape-rendering="optimizeQuality" ></circle>
    </g>
  </svg>
</template>

<style scoped>
</style>

<script>
import Random from '@/helper/random'

export default {
  props: ['seed'],

  data() {
    return {
      colors: ["#6495ED", "goldenrod", "#cd5c5c", "thistle", "lightgray"],
      cx: 80,
      cy: 80,
      radius: 60,
      strokeWidth: 30,
      angleOffset: -90,
    }
  },

  computed: {
    rng() {
      return new Random(this.seed);
    },

    circumference() {
      return 2 * Math.PI * this.radius
    },

    sortedValues() {
      let values = []
      let x = 1
      while(x > 0) {
        let part = Math.min(x, this.rng.number())
        values.push(part)
        x -= part
      }
      return values
    },

    calculateOffset() {
      var angleOffset = -90

      return this.sortedValues.map(x => {
        let res = this.angleOffset
        this.angleOffset = x * 360 + this.angleOffset
        return res
      })
    },

    adjustedCircumference() {
      return this.circumference - 2
    }
  },

  methods: {
    calculateStrokeDashOffset(percentage, circumference) {
      const strokeDiff = percentage * circumference
      return circumference - strokeDiff
    },

    returnCircleTransformValue(index) {
      return `rotate(${this.calculateOffset[index]}, ${this.cx}, ${this.cy})`
    },
  },

  mounted() {
    this.sortedValues
    this.calculateOffset
  }

}

</script>
