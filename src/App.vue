<template>
  <v-app>
    <v-container fill-height>
      <v-row justify="center" align="center">
        <div class="text-center">
          <v-btn color="blue" dark @click="startLoop">
            Do not click this button
          </v-btn>
        </div>
      </v-row>
    </v-container>
    <Dialog
      v-for="(captcha, i) in captchas"
      :key="i"
      :dialog="!!(captcha.text && captcha.text.length)"
      :captcha="captcha"
      :index="i"
      @trigger-loop="triggerLoop"
    />
  </v-app>
</template>

<script>
import svgCaptcha from "svg-captcha-browser";

export default {
  name: "App",
  data: () => ({
    dialog: false,
    captchas: [],
    fontList: [],
  }),
  components: {
    Dialog: require("./components/Dialog").default,
  },
  created() {
    this.fontList = require("../fontSheet.json")
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  },
  methods: {
    async startLoop() {
      this.dialog = true;
      await this.generateCaptcha(0);
    },
    async generateCaptcha(index) {
      if (this.captchas.length > 3)
        this.$vuetify.theme.dark = !!this.randomNumberBetween(0, 1);
      svgCaptcha.loadFont(this.fontList[index]).then(() => {
        let captcha = svgCaptcha.create(this.generateRandomCaptchaSettings());
        this.captchas.push(captcha);
      });
    },
    generateRandomCaptchaSettings() {
      return {
        size:
          this.captchas.length == 3
            ? this.randomNumberBetween(7, 8)
            : this.randomNumberBetween(0, 5)
            ? this.randomNumberBetween(4, 6)
            : this.randomNumberBetween(6, 10),
        noise: this.randomNumberBetween(1, 4),
        color: this.randomNumberBetween(0, 1),
        background: this.randomNumberBetween(0, 1)
          ? `#${Math.floor(Math.random() * 16777215).toString(16)}`
          : null,
      };
    },
    randomNumberBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    async triggerLoop() {
      await this.generateCaptcha(
        (this.captchas.length + 1) % this.fontList.length
      );
    },
  },
};
</script>
