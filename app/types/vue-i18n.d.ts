import type { Composer } from "vue-i18n"

declare module "vue" {
  interface ComponentCustomProperties {
    $t: Composer["t"]
    $rt: Composer["rt"]
    $n: Composer["n"]
    $d: Composer["d"]
    $tm: Composer["tm"]
    $te: Composer["te"]
  }
}
