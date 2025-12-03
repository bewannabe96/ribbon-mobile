# Common
- 최대한 useMemo와 useCallback을 사용해야 함

# Database
Database Schema (Used Tables Only)

1.public_event (메인 테이블)
```
{
id: number                    // PK
uuid: string                  // Unique identifier
name: string                  // Original name
refined_name: string          // Refined/display name
category: event_category      // Enum: lecture|exhibition|experience|performance|festival
description: string | null
institution_name: string
start_date: string
end_date: string
venue_name: string | null
venue_address: string | null
venue_location: geography     // PostGIS point
venue_type: venue_type | null // Enum: offline|online|hybrid
capacity: number | null
participation_fee: number | null
contact_phone: string | null
target_residence: string | null
registration_methods: registration_method[] | null
source_url: string
created_at: string
updated_at: string
crawled_event_id: number      // FK to crawled_event
}
```

2.public_event_tag (Tags - 정규화됨)
```
{
id: number          // PK
pe_id: number       // FK to public_event.id
tag: string
}
```

3.pe_district (Event-District relation)
```
{
id: number          // PK
pe_id: number       // FK to public_event.id
district_id: number // FK to district.id
}
```

4.district (행정구역)
```
{
id: number          // PK
name: string
level: number       // 계층 레벨 (0: 시/도, 1: 구/군, etc.)
created_at: string
updated_at: string
}
```

5.pe_registration_session (접수 기간)
```
{
id: number          // PK
pe_id: number       // FK to public_event.id
open_dt: string | null   // 접수 시작
close_dt: string | null  // 접수 종료
}
```

6.pe_timetable_slot (시간표)
```
{
id: number          // PK
pe_id: number       // FK to public_event.id
day: number         // 요일 (0-6)
start_time: string  // HH:MM
end_time: string    // HH:MM
}
```

Relationships

- public_event 1:N public_event_tag
- public_event 1:N pe_district N:1 district
- public_event 1:N pe_registration_session
- public_event 1:N pe_timetable_slot
