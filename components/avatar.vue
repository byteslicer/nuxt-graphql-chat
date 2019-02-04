<template>
  <svg height="32" width="32" viewBox="0 0 160 160">
      <g>
        <circle :cx="cx" :cy="cy" :r="radius" fill="transparent" stroke="#0c1b27" :stroke-width="strokeWidth" shape-rendering="optimizeQuality"></circle>
        <no-ssr>
          <circle v-for="(value, index) in sortedValues"
            :key="index"
            :cx="cx"
            :cy="cy"
            :r="radius"
            fill="transparent"
            :stroke="filteredColor[index]"
            :stroke-width="strokeWidth"
            :stroke-dasharray="adjustedCircumference"
            :stroke-dashoffset="calculateStrokeDashOffset(value, circumference)"
            :transform="returnCircleTransformValue(index)"
            shape-rendering="optimizeQuality"
            style="opacity: 0">
            <animate attributeType="CSS" attributeName="opacity"
           from="0" to="1" dur="1s" fill="freeze"/>
          </circle>
        </no-ssr>
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
      colorPalette: ["#1b85b8", "#5a5255", "#559e83", "#ae5a41", "#c3cb71"],
      cx: 80,
      cy: 80,
      radius: 60,
      strokeWidth: 30,
      angleOffset: -90,
    }
  },

  computed: {
    isServer() {
      return process.server
    },

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
    },

    colors() {
      return this.sortedValues.map(() => this.rng.select(this.colorPalette))
    },

    filteredColor() {
      let result = this.colors

      for (var i = 1; i < result.length; i++) {
        if(result[i] === result[i-1]) {
          result[i] = this.rng.select(this.colorPalette)
        }
      }
      return result
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
