-- Base seed for FECNA 2026 / LINANORT 2026

-- Federation
insert into federations (code, name, country_code)
values ('FECNA', 'Federacion Colombiana de Natacion', 'CO')
on conflict do nothing;

-- Championship types
insert into championship_types (code, name)
values
('Interligas', 'Interligas'),
('Interclubes', 'Interclubes'),
('Infantiles', 'Infantiles')
on conflict do nothing;

-- League (LINANORT)
insert into leagues (federation_id, name, region)
select f.id, 'LINANORT', 'Norte de Santander'
from federations f
where f.code = 'FECNA'
on conflict do nothing;

-- Categories
insert into categories (name, max_events, note)
values
('Menores', 4, 'Limite especial para 7-8 anos'),
('Infantil A', 6, null),
('Infantil B', 6, null),
('Juvenil A', 6, null),
('Juvenil B', 6, null),
('Junior', 6, null),
('Mayores', 6, null),
('Masters', 6, 'Aplicar grupos 20-29, 30-39, 40-49, 50-59, 60+')
on conflict do nothing;

-- Age groups (2026 reference)
insert into age_groups (category_id, name, min_age, max_age, birth_years, is_relay_group)
select c.id, 'Menores 7-9', 7, 9, '2019-2017', true from categories c where c.name = 'Menores'
union all
select c.id, 'Menores 7', 7, 7, '2019', false from categories c where c.name = 'Menores'
union all
select c.id, 'Menores 8', 8, 8, '2018', false from categories c where c.name = 'Menores'
union all
select c.id, 'Menores 9', 9, 9, '2017', false from categories c where c.name = 'Menores'
union all
select c.id, 'Infantil 10-13', 10, 13, '2016-2013', true from categories c where c.name = 'Infantil A'
union all
select c.id, 'Infantil A 10-11', 10, 11, '2016-2015', false from categories c where c.name = 'Infantil A'
union all
select c.id, 'Infantil B 12-13', 12, 13, '2014-2013', false from categories c where c.name = 'Infantil B'
union all
select c.id, 'Juvenil A 14-15', 14, 15, '2012-2011', false from categories c where c.name = 'Juvenil A'
union all
select c.id, 'Juvenil B 16-17', 16, 17, '2010-2009', false from categories c where c.name = 'Juvenil B'
union all
select c.id, 'Junior 18-20', 18, 20, '2008-2006', false from categories c where c.name = 'Junior'
union all
select c.id, 'Mayores 21+', 21, 99, '2005-1900', false from categories c where c.name = 'Mayores'
union all
select c.id, 'Masters 20-29', 20, 29, '2006-1997', false from categories c where c.name = 'Masters'
union all
select c.id, 'Masters 30-39', 30, 39, '1996-1987', false from categories c where c.name = 'Masters'
union all
select c.id, 'Masters 40-49', 40, 49, '1986-1977', false from categories c where c.name = 'Masters'
union all
select c.id, 'Masters 50-59', 50, 59, '1976-1967', false from categories c where c.name = 'Masters'
union all
select c.id, 'Masters 60+', 60, 99, '1966-1900', false from categories c where c.name = 'Masters'
;

-- Events (common set)
insert into events (name, style, distance_m, event_type, relay_swimmers, gender)
values
('25 Libre', 'Libre', 25, 'individual', null, 'M'),
('25 Libre', 'Libre', 25, 'individual', null, 'F'),
('25 Patadas', 'Patadas', 25, 'individual', null, 'M'),
('25 Patadas', 'Patadas', 25, 'individual', null, 'F'),
('50 Libre', 'Libre', 50, 'individual', null, 'M'),
('50 Libre', 'Libre', 50, 'individual', null, 'F'),
('100 Libre', 'Libre', 100, 'individual', null, 'M'),
('100 Libre', 'Libre', 100, 'individual', null, 'F'),
('200 Libre', 'Libre', 200, 'individual', null, 'M'),
('200 Libre', 'Libre', 200, 'individual', null, 'F'),
('400 Libre', 'Libre', 400, 'individual', null, 'M'),
('400 Libre', 'Libre', 400, 'individual', null, 'F'),
('800 Libre', 'Libre', 800, 'individual', null, 'M'),
('800 Libre', 'Libre', 800, 'individual', null, 'F'),
('1500 Libre', 'Libre', 1500, 'individual', null, 'M'),
('1500 Libre', 'Libre', 1500, 'individual', null, 'F'),
('50 Espalda', 'Espalda', 50, 'individual', null, 'M'),
('50 Espalda', 'Espalda', 50, 'individual', null, 'F'),
('100 Espalda', 'Espalda', 100, 'individual', null, 'M'),
('100 Espalda', 'Espalda', 100, 'individual', null, 'F'),
('200 Espalda', 'Espalda', 200, 'individual', null, 'M'),
('200 Espalda', 'Espalda', 200, 'individual', null, 'F'),
('50 Pecho', 'Pecho', 50, 'individual', null, 'M'),
('50 Pecho', 'Pecho', 50, 'individual', null, 'F'),
('100 Pecho', 'Pecho', 100, 'individual', null, 'M'),
('100 Pecho', 'Pecho', 100, 'individual', null, 'F'),
('200 Pecho', 'Pecho', 200, 'individual', null, 'M'),
('200 Pecho', 'Pecho', 200, 'individual', null, 'F'),
('50 Mariposa', 'Mariposa', 50, 'individual', null, 'M'),
('50 Mariposa', 'Mariposa', 50, 'individual', null, 'F'),
('100 Mariposa', 'Mariposa', 100, 'individual', null, 'M'),
('100 Mariposa', 'Mariposa', 100, 'individual', null, 'F'),
('200 Mariposa', 'Mariposa', 200, 'individual', null, 'M'),
('200 Mariposa', 'Mariposa', 200, 'individual', null, 'F'),
('200 Combinado', 'Combinado', 200, 'individual', null, 'M'),
('200 Combinado', 'Combinado', 200, 'individual', null, 'F'),
('400 Combinado', 'Combinado', 400, 'individual', null, 'M'),
('400 Combinado', 'Combinado', 400, 'individual', null, 'F'),
('4x50 Libre', 'Libre', 50, 'relay', 4, 'M'),
('4x50 Libre', 'Libre', 50, 'relay', 4, 'F'),
('4x50 Libre Mixto', 'Libre', 50, 'relay', 4, 'Mixed'),
('4x100 Libre', 'Libre', 100, 'relay', 4, 'M'),
('4x100 Libre', 'Libre', 100, 'relay', 4, 'F'),
('4x100 Libre Mixto', 'Libre', 100, 'relay', 4, 'Mixed'),
('4x200 Libre', 'Libre', 200, 'relay', 4, 'M'),
('4x200 Libre', 'Libre', 200, 'relay', 4, 'F'),
('4x200 Libre Mixto', 'Libre', 200, 'relay', 4, 'Mixed')
on conflict do nothing;

-- Category events (minimal defaults)
insert into category_events (category_id, event_id)
select c.id, e.id
from categories c
join events e on e.event_type = 'individual'
where c.name in ('Infantil A','Infantil B','Juvenil A','Juvenil B','Junior','Mayores','Masters')
on conflict do nothing;

-- Menores: only 25m (Libre/Patadas) and 50 Libre
insert into category_events (category_id, event_id)
select c.id, e.id
from categories c
join events e on e.name in ('25 Libre','25 Patadas','50 Libre')
where c.name = 'Menores'
on conflict do nothing;

-- Relay events for all categories
insert into category_events (category_id, event_id)
select c.id, e.id
from categories c
join events e on e.event_type = 'relay'
on conflict do nothing;
