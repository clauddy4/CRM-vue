<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_NewRecord' | localize }}</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!goals.length">
      {{ 'NoGoals' | localize }}.
      <router-link to="/goals">{{ 'Add' | localize }}</router-link>
    </p>

    <form class="form" v-else @submit.prevent="submitHandler">
      <div class="input-field">
        <select ref="select" v-model="goal">
          <option v-for="g in goals" :key="g.id" :value="g.id">
            {{ g.title }}
          </option>
        </select>
        <label>{{ 'SelectGoal' | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ 'Income' | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ 'Outcome' | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <label for="amount">{{ 'Amount' | localize }}</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
        >
          {{ 'Message_MinLength' | localize }}
          {{ $v.amount.$params.minValue.min }}
        </span>
      </div>

      <button class="btn waves-effect waves-light cyan lighten-1" type="submit">
        {{ 'Create' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { minValue, required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import localizeFilter from '../filters/localize.filter'

export default {
  name: 'GRecord',
  data: () => ({
    loading: true,
    goals: [],
    select: null,
    goal: null,
    type: 'outcome',
    amount: 1,
    description: '',
  }),
  methods: {
    async submitHandler() {
      try {
        console.log("heeere")
        await this.$store.dispatch('createGRecord', {
          goalId: this.goal,
          amount: this.amount,
          type: this.type,
          date: new Date().toJSON(),
        })
        const bill =
          this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount

        await this.$store.dispatch('updateInfo', { bill })
        this.$message(localizeFilter('RecordHasBeenCreated'))
        this.$v.$reset()
        this.amount = 1
        this.description = ''
      } catch (e) {}

    },
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
  async mounted() {
    this.goals = await this.$store.dispatch('fetchGoals')
    this.loading = false

    if (this.goals.length) {
      this.goal = this.goals[0].id
    }

    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select)
      M.updateTextFields()
    }, 0)
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  validations: {
    description: { required },
    amount: { minValue: minValue(1) },
  },
}
</script>
