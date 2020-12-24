<template>
  <div>
    <div class="page-title">
      <h3>{{ 'History_Title' | localize }}</h3>
    </div>

        <label>{{ 'SelectPeriod' | localize }}</label>
        <select class="date-select" v-model="selected">
          <option class="date-option" selected value="">{{ 'ForAllTheTimes' | localize }}</option>
          <option v-for="date in dates" :key=date :value="date">{{month(date)}}</option>
        </select>

    <div class="history-chart" :class="!records.length ? 'hidden' : ''">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!records.length">
      {{ 'NoRecords' | localize }}.
      <router-link to="/record">{{ 'AddFirst' | localize }}</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items" />
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back' | localize"
        :next-text="'Forward' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />

      <div class="input-field col s12">
  </div>

    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import HistoryTable from '../components/HistoryTable'
import paginationMixin from '../mixins/pagination.mixin'
import { Pie } from 'vue-chartjs'
import localizeFilter from '../filters/localize.filter'

export default {
  name: 'History',
  components: {
    HistoryTable,
  },
  mixins: [paginationMixin],
  extends: Pie,
  data: () => ({
    loading: true,
    records: [],
    displayedRecords: [],
    selected: '',
    cats: [],
    dates: []
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    this.displayedRecords = this.records
    const categories = await this.$store.dispatch('fetchCategories')
    this.cats = categories

    this.selectBuilder()

    this.setup(categories)
    this.loading = false
  },
  watch: {
      selected() {
        this.records = this.displayedRecords
        if (this.selected) {
          this.records = this.records.filter(arr => arr.date.substr(5,2) == this.selected)
        }
        else this.records = this.displayedRecords
        const categories = this.$store.dispatch('fetchCategories')
        this.setup(this.cats)
    }
  },
  methods: {
    selectBuilder() {
      this.records.forEach(i => this.dates.push(i.date.substr(5,2)))
      this.dates = new Set(this.dates.reverse())
    },
    month(date) {
      switch(date) {
        case '01':
          return localizeFilter('January')
          break
        case '02':
          return localizeFilter('February')
          break
        case '03':
          return localizeFilter('March')
          break
        case '04':
          return localizeFilter('April')
          break
        case '05':
          return localizeFilter('May')
          break
        case '06':
          return localizeFilter('June')
          break
        case '07':
          return localizeFilter('July')
          break
        case '08':
          return localizeFilter('August')
          break
        case '09':
          return localizeFilter('September')
          break
        case '10':
          return localizeFilter('October')
          break
        case '11':
          return localizeFilter('November')
          break
        case '12':
          return localizeFilter('December')
          break
      }
    },
    setup(categories) {
      this.setupPagination(
        this.records.slice().reverse().map((record) => {
          return {
            ...record,
            categoryName: categories.find((c) => c.id === record.categoryId)
              .title,
            typeClass: record.type === 'income' ? 'green' : 'red',
            typeText:
              record.type === 'income'
                ? localizeFilter('Income')
                : localizeFilter('Outcome'),
          }
        })
      )

      this.renderChart({
        labels: categories.map((c) => c.title),
        datasets: [
          {
            label: localizeFilter('CostsForCategories'),
            data: categories.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === 'outcome') {
                  total += +r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(218, 65, 103, 0.3)',
              'rgba(8, 61, 119, 0.2)',
              'rgba(192, 226, 24, 0.2)',
              'rgba(131, 169, 92, 0.2)',
              
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(218, 65, 103, 1)',
              'rgba(8, 61, 119, 0.8)',
              'rgba(192, 226, 24, 1)',
              'rgba(131, 169, 92, 1)',
            ],
            borderWidth: 1,
          },
        ],
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
