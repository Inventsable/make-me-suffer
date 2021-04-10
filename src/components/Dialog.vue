<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-text>
        <div class="captcha-container" v-html="captcha.data || `<div />`"></div>
        <v-form
          ref="form"
          v-model="isValid"
          lazy-validation
          @submit="validate"
          style="height: 70px; max-height: 70px; min-height: 70px"
        >
          <v-text-field
            v-model="text"
            label="Solve this CAPTCHA"
            :rules="rules"
            hide-details="auto"
            :counter="captcha.text.length"
            @blur="validate"
            @update="validate"
            @keydown.enter="checkValidation"
            autofocus
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!text.length || !isValid"
          text
          color="deep-purple accent-4"
          @click="checkValidation"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    captcha: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      captchaHTML: null,
      text: "",
      rules: [
        (value) => !!value || "Can't continue until you do",
        (value) =>
          (value && value.length >= 3) || "Must be at least 4 characters",
        (value) => {
          return (
            (value && value.length <= this.captcha.text.length) ||
            `Must be ${this.captcha.text.length} characters long`
          );
        },
        (value) => {
          return (
            value == this.captcha.text ||
            "You could solve this if you were human"
          );
        },
      ],
      isValid: false,
    };
  },
  computed: {
    title() {
      let str = "verify your identity to ";
      for (let i = 0; i < this.index; i++) str += "verify your identity to ";
      return `Please ${str} continue`;
    },
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    checkValidation() {
      this.validate();
      if (this.isValid) this.$emit("trigger-loop");
    },
  },
};
</script>

<style>
.captcha-container {
  padding-bottom: 12px;
  display: flex;
  justify-content: center;
}

.captcha-container svg {
  width: fit-content;
  height: fit-content;
}

.v-card__text {
  padding-bottom: 0px !important;
}
</style>