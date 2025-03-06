<template>
  <view>
    <view class="step1">
      <view class="form-item">
        <view class="form-item-label">
          <text>證件類型</text>

          <text>（當前僅支持護照辦理）</text>
        </view>

        <view class="form-item-input">
          <input v-model="localFormData.type[0].name" required disabled type="text" placeholder="輸入" />
        </view>
      </view>

      <view class="form-item">
        <view class="form-item-label">
          <text>請選擇證件簽發的國家/地區</text>
        </view>

        <view class="form-item-input" @tap="onModalOpen">
          <input v-model="localFormData.countryName" disabled required type="text" placeholder="輸入" />

          <view class="arrow-down-icon">
            <image src="../../../../../static/icons/icon-arrow-down.png" mode="scaleToFill" />
          </view>
        </view>
      </view>

      <view class="form-item">
        <view class="form-item-label">
          <text>證件號碼</text>
        </view>

        <view class="form-item-input">
          <input v-model="localFormData.idCard" required type="text" placeholder="輸入" />
        </view>
      </view>

      <view class="form-item__group">
        <view class="form-item">
          <view class="form-item-label">
            <text>您的姓氏</text>
          </view>

          <view class="form-item-input">
            <input v-model="localFormData.firstName" required type="text" placeholder="輸入" />
          </view>
        </view>

        <view class="form-item">
          <view class="form-item-label">
            <text>您的名字</text>
          </view>

          <view class="form-item-input">
            <input v-model="localFormData.lastName" required type="text" placeholder="輸入" />
          </view>
        </view>
      </view>

      <view class="next-btn" @tap="goNext">
        <text>下一步</text>
      </view>
    </view>

    <CustomModal title="選擇國家/地區" mode="bottom" ref="countryPicker">
      <view class="country-picker">
        <!-- 快速索引栏 -->

        <view class="index-bar">
          <text v-if="letter !== 'Å'" v-for="letter in indexList" :key="letter" @tap="scrollToLetter(letter)">
            {{ letter }}
          </text>
        </view>

        <!-- 国家列表 -->

        <scroll-view scroll-y class="country-scroll" :scroll-into-view="currentIndex">
          <view class="country-list">
            <view v-for="group in groupedCountries" :key="group.letter" :id="'index-' + group.letter">
              <view class="letter-title">
                {{ group.letter }}
              </view>

              <view v-for="country in group.countries" :key="country.code" class="country-item"
                @tap="handleSelectCountry(country)">
                <view class="country-info">
                  <text class="country-name">{{ country.name }}</text>
                </view>

                <text v-if="localFormData.country === country.code" class="selected">
                  ✓
                </text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </CustomModal>
  </view>
</template>

<script>
import CustomModal from '../../../../../components/custom-modal.vue'
import countries from '../../../../../static/data/countries.json'
// import 'flag-icons/css/flag-icons.min.css'

export default {
  components: {
    CustomModal,
  },
  name: 'Step1',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      localFormData: {
        type: [
          { type: 1, name: '護照' },
        ],
        idCard: '',
        countryCode: '',
        countryName: '',
        firstName: '',
        lastName: '',
      },
      groupedCountries: [],
      indexList: [],
      currentIndex: '',
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        if (newVal) {
          this.localFormData = { ...this.localFormData, ...newVal }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initialCountriesData()
  },
  methods: {
    isEmptyString(str) {
      return !str || typeof str !== 'string' || str.trim() === ''
    },
    validator() {
      const validations = [
        {
          condition: this.isEmptyString(this.localFormData.countryName) || this.isEmptyString(this.localFormData.countryCode),
          message: '請選擇國家/地區'
        },
        {
          condition: this.isEmptyString(this.localFormData.idCard),
          message: '請輸入護照號碼'
        },
        {
          condition: this.isEmptyString(this.localFormData.firstName) || this.isEmptyString(this.localFormData.lastName),
          message: '請輸入名字和姓氏'
        }
      ]

      for (const { condition, message } of validations) {
        if (condition) {
          uni.showToast({
            title: message,
            icon: 'none'
          })
          return false
        }
      }
      return true
    },
    goNext() {
      if (!this.validator()) return

      const data = {
        idCard: this.localFormData.idCard,
        country: this.localFormData.countryName,
        realName: this.localFormData.firstName + this.localFormData.lastName,
      }

      this.$emit('update:step', 1, data)
    },
    handleSelectCountry(country) {
      this.localFormData.countryCode = country.code
      this.localFormData.countryName = country.name
      this.$refs.countryPicker.close()
    },

    onModalOpen() {
      this.$refs.countryPicker.open()
      if (this.selectedLetter) {
        this.scrollToLetter(this.selectedLetter)
      }
    },

    scrollToLetter(letter) {
      this.currentIndex = 'index-' + letter
    },

    initialCountriesData() {
      // 处理中国及港澳台地区
      const chinaRegions = countries
        .filter((country) => ['CN', 'HK', 'MO', 'TW'].includes(country.code))
        .map((country) => {
          // 修正名称
          switch (country.code) {
            case 'CN':
              return { ...country, name: '中国大陆' }
            case 'HK':
              return { ...country, name: '中国香港' }
            case 'MO':
              return { ...country, name: '中国澳门' }
            case 'TW':
              return { ...country, name: '中国台湾' }
          }
        })

      // 其他国家
      const otherCountries = countries.filter(
        (country) => !['CN', 'HK', 'MO', 'TW'].includes(country.code)
      )

      // 按英文名称首字母分组
      const groups = {}

      // 中国及港澳台统一放在 C 组最前面
      groups['C'] = chinaRegions

      // 处理其他国家
      otherCountries.forEach((country) => {
        // 处理特殊字符，将 Å 转换为 A
        let letter = country.name.charAt(0)
        letter = letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        if (!groups[letter]) {
          groups[letter] = []
        }
        groups[letter].push(country)
      })

      // 转换为数组并排序
      this.groupedCountries = Object.entries(groups)
        .map(([letter, items]) => ({
          letter,
          countries:
            letter === 'C'
              ? items // 中国相关地区保持原顺序
              : items.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.letter.localeCompare(b.letter))

      this.indexList = this.groupedCountries.map((group) => group.letter)
    },
  },
}
</script>

<style lang="scss" scoped>
.step1 {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &-label {
      padding: 0 8px 0 8px;

      text {
        font-size: 14px;
        font-weight: 500;
      }

      text:nth-child(1) {
        color: #fff;
      }

      text:nth-child(2) {
        color: rgba($color: #ebebf5, $alpha: 0.6);
      }
    }

    &-input {
      position: relative;
      cursor: pointer;

      input {
        padding: 0 calc(16px + 8px) 0 16px;
        width: 100%;
        border-radius: 14px;
        height: 44px;
        background: #070708;
        border: 2px solid rgba($color: #b2c6de, $alpha: 0.4);
        color: #fff;
        font-size: 16px;
        line-height: 22px;
        box-sizing: border-box;

        :disabled {
          pointer-events: none;
        }
      }

      .arrow-down-icon {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    &__group {
      display: flex;
      flex-direction: row;
      gap: 15px;
    }
  }

  .next-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 48px;
    border-radius: 14px;
    background: #f0c473;
    margin-top: 40px;

    text {
      font-size: 17px;
      font-weight: 600;
      color: #000;
    }
  }
}

.country-picker {
  position: relative;
  height: 70vh;
  padding-top: env(safe-area-inset-top); // 顶部安全区

  .index-bar {
    position: fixed;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    background: #2e2f36;
    border-radius: 18px;
    padding: 16px 6px 16px 6px;

    text {
      font-size: 13px;
      font-weight: bold;
      color: #1a7adf;
    }
  }

  .country-scroll {
    height: 100%;
  }

  .country-list {
    padding: 0 20px;

    .letter-title {
      padding: 10px 0;
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
    }

    .country-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .country-name {
        color: #fff;
        font-size: 16px;
      }

      .selected {
        color: #f0c473;
      }
    }
  }
}
</style>
