<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{
          'Menu_History' | localize
        }}</router-link>
        <a @click.prevent class="breadcrumb">
          {{ record.type === 'income' ? 'Income' : 'Outcome' | localize }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="{
              red: record.type === 'outcome',
              green: record.type === 'income',
            }"
          >
            <div class="card-content white-text">
              <p>{{ 'Description' | localize }}: {{ description }}</p>
              <p>{{ 'Amount' | localize }}: {{ amount | currency }}</p>
              <p>{{ 'Category' | localize }}: {{ record.categoryName }}</p>

              <small>{{ record.date | date('datetime') }}</small>
            </div>
          </div>

          <form class="form" @submit.prevent="submitHandler">

            <div class="input-field">
              <input
                id="amount"
                type="number"
                v-model="amount"
              />
            </div>

            <div class="input-field">
              <input
                id="description"
                type="text"
                v-model.number="description"
              />
            </div>

            <button class="btn waves-effect waves-light cyan lighten-1" type="submit">
              {{ 'Refresh' | localize }}
              <i class="material-icons right">send</i>
            </button>
          </form>
        </div>
      </div>
    </div>
    <p class="center" v-else>Такая запись не найдена</p>
  </div>
</template>

<script>
import localizeFilter from '../filters/localize.filter'
import { mapGetters } from 'vuex'

export default {
  name: 'Detail',
  data: () => ({
    record: null,
    loading: true,
    amount: 1,
    description: '',
    id: null,
    initialAmount: 1,
  }),
  async mounted() {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch(
      'fetchCategoryById',
      record.categoryId
    )
    this.initialAmount = record.amount

    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()

    this.record = {
      ...record,
      categoryName: category.title,
    }

    const { amount, description } = this.record
    this.amount = amount
    this.description = description

    this.loading = false
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }
      return this.info.bill >= this.amount
    },
  },
  methods: {
    async submitHandler() {
      try {
        const recordData = {
          id: this.record.id,
          amount: this.amount,
          description: this.description,
        }
        await this.$store.dispatch('updateRecord', recordData)

        const bill =
        this.record.type === 'income'
              ? this.info.bill + +this.amount - +this.initialAmount
              : this.info.bill - +this.amount + +this.initialAmount

        await this.$store.dispatch('updateInfo', { bill })

        this.$message(localizeFilter('Category_HasBeenUpdated'))
        this.$emit('updated', recordData)
      } catch (e) {}
    },
  },
}
</script>
