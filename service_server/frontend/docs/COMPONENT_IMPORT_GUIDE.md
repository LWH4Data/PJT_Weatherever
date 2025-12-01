# WEATHEREVER 컴포넌트 Import 가이드라인

## 📋 원칙

### 1. Atomic Design 계층 준수
```
atoms → molecules → organisms → templates
```
- **상위 레벨**은 **하위 레벨**만 import 가능
- **하위 레벨**이 **상위 레벨** import 금지 (순환 참조 방지)

### 2. 직접 Import 권장
```javascript
// ✅ 권장: 직접 경로 사용
import { Button, Text } from '../components/atoms';
import { Header } from '../components/molecules';
import { WeatherDisplay } from '../components/organisms';

// ❌ 비권장: 배럴 export 체인
import { Button } from '../components';
```

### 3. 동일 레벨 Import 허용
```javascript
// ✅ 허용: molecules 내에서 molecules 참조
import { AnimatedCharacterDisplay } from '../AnimatedCharacterDisplay';
```

## 🚫 순환 참조 방지 체크리스트

### Before Import:
1. **계층 확인**: atoms < molecules < organisms 순서 준수?
2. **필요성 검토**: 정말 상위 레벨 컴포넌트가 필요한가?
3. **대안 검토**: props로 전달하거나 더 작은 단위로 분해 가능한가?

### 순환 참조 발생시 해결책:
1. **컴포넌트 재분류**: 올바른 atomic 레벨로 이동
2. **의존성 역전**: props로 컴포넌트 전달
3. **공통 로직 분리**: utils나 hooks로 추출

## 📁 권장 import 패턴

```javascript
// atoms에서
import React from 'react';
import { View, Text } from 'react-native';
// ❌ molecules, organisms import 금지

// molecules에서  
import React from 'react';
import { Button, Text } from '../atoms';        // ✅ 하위 레벨
import { OtherMolecule } from '../OtherMolecule'; // ✅ 동일 레벨
// ❌ organisms import 금지

// organisms에서
import React from 'react';
import { Button } from '../atoms';              // ✅ 하위 레벨
import { Header, WeatherCard } from '../molecules'; // ✅ 하위 레벨
import { OtherOrganism } from '../OtherOrganism';   // ✅ 동일 레벨

// templates에서 (최상위)
import React from 'react';
import { Button } from '../atoms';              // ✅ 모든 하위 레벨 가능
import { Header } from '../molecules';
import { WeatherDisplay } from '../organisms';
```

## 🔧 문제 해결 시나리오

### Q: molecule이 organism을 사용하고 싶다면?
**A: 컴포넌트 재분류 검토**
- organism → molecule로 이동 가능한지 확인
- 실제 복잡도가 molecule 수준인지 검토

### Q: 배럴 export 사용해도 되나요?
**A: 제한적 사용 권장**
- 동일 레벨 내에서만 사용
- 최상위 components/index.ts 사용 금지
- 각 레벨별 index.ts는 필요시에만

### Q: 순환 참조 경고가 나타나면?
**A: 즉시 수정**
1. import 경로 추적
2. 계층 구조 재검토 
3. 필요시 컴포넌트 재분류

---

## 📊 현재 WEATHEREVER 구조 (2025.09.19 기준)

### ✅ 올바른 예시들:
- `MainScreen`: 각 레벨에서 직접 import
- `LocationPermissionModal`: 동일 레벨 atoms 직접 import
- `WeatherSection`: 하위 레벨 molecules import

### 🔄 최근 개선 사항:
- atoms 순환 참조 해결 완료
- molecules/organisms 순환 참조 해결 완료  
- 배럴 export 구조 최적화 완료
