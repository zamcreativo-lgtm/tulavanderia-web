# Guía de TuLavandería

Cómo cambiar cosas de tu sitio sin complicarte.

**La regla de oro:** todo pasa por GitHub. Nunca subas archivos a mano a
Cloudflare. GitHub avisa a Cloudflare y el sitio se actualiza solo en un minuto.

---

## 1. Cambiar un texto (lo más común)

Sin programas, sin comandos. Desde el navegador, incluso desde el celular.

1. Entra a `github.com/zamcreativo-lgtm/tulavanderia-web`
2. Clic en la carpeta **public**
3. Clic en **index.html**
4. Clic en el **lápiz** (arriba a la derecha)
5. Busca el texto con **Ctrl+F**, cámbialo
6. Botón verde **Commit changes**, y otra vez **Commit changes** en la ventanita

Espera un minuto y revisa `tulavanderia.com.mx`. Si ves el texto viejo,
refresca con **Ctrl+F5**.

> Si te arrepientes antes de guardar: sal de la página sin dar Commit y no pasa
> nada.

---

## 2. Cambiar la foto de la landing

1. En GitHub, entra a la carpeta **public**
2. **Add file → Upload files**
3. Arrastra tu foto nueva, que debe llamarse exactamente **hero.webp**
4. **Commit changes**

La foto nueva reemplaza la anterior.

---

## 3. Actualizar el sistema (el login)

Esta es la única que necesita la computadora, y pasa de vez en cuando, no a
diario. Cuando Claude te entregue el archivo nuevo del sistema:

1. Abre la carpeta `Escritorio\tulavanderia-web` en el explorador
2. Clic en la barra de direcciones de arriba, escribe `cmd` y Enter
3. Escribe esto, con la ruta de tu archivo:

       node desempacar.js "C:\ruta\al\archivo-de-claude.html"

4. Pruébalo antes de publicar:

       node servidor.js

   Abre `http://localhost:8080/login`, entra con tu cuenta y revisa que todo
   funcione. Para detener el servidor, **Ctrl+C**.

5. Publícalo:

       git add -A
       git commit -m "Actualiza el sistema"
       git push

**Si te atoras en este punto, pídeme ayuda.** No es algo que tengas que
memorizar.

---

## 4. Tu flujo de venta (solo para ti)

Cuando alguien quiere contratar:

1. **Te llega el WhatsApp** con el plan que eligió, desde la página.
2. **Le pasas tu CLABE** para que haga la transferencia.
3. **Él te manda el comprobante** por WhatsApp. No avances hasta verlo reflejado
   en tu cuenta: la transferencia entre bancos distintos puede tardar unos minutos.
4. **Le creas la cuenta** en Supabase: Authentication → Users → **Add user**, con su
   correo y una contraseña temporal. Marca que el correo quede confirmado.
5. **Le activas la licencia** en Table Editor → `licencias`, o con esto en el SQL
   Editor, cambiando el correo y los días según el plan que pagó:

       update public.licencias
       set estado = 'activa', plan = 'mensual',
           vence_el = now() + interval '30 days'
       where user_id = (select id from auth.users where email = 'cliente@correo.com');

   Para los otros planes: 90 días el trimestral, 180 el semestral, 365 el anual.
   Para una prueba gratis, 7 días con `plan = 'prueba'`.

6. **Le mandas sus accesos** por WhatsApp y le dices que cambie su contraseña
   dentro del sistema, en Configuración ⚙️.

Para ver cómo va cada cliente y quién está por vencer:

    select u.email, l.estado, l.plan, l.vence_el
    from public.licencias l
    join auth.users u on u.id = l.user_id
    order by l.vence_el;

**Ojo:** los clientes no pueden registrarse solos. El botón "Ver planes" del login
los manda a la página, y sin que tú los des de alta no hay manera de entrar.

---

## 5. Si algo salió mal

**El sitio se ve roto o falta algo:** en Cloudflare, entra al Worker
`tulavanderia`, sección de implementaciones, y regresa a una anterior. Tarda
segundos y el sitio vuelve a como estaba.

**Cambiaste un texto y te arrepentiste:** vuelve a GitHub y cámbialo de nuevo.
Nada se pierde, GitHub guarda todas las versiones.

**No se ve tu cambio:** refresca con **Ctrl+F5**. Si sigue igual, revisa en
Cloudflare que la compilación haya terminado bien.

---

## 6. Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Textos de la página principal | GitHub → `public/index.html` |
| Foto de la landing | GitHub → `public/hero.webp` |
| El sistema (login) | GitHub → `public/login.html` — no se edita a mano, ver punto 3 |
| Piezas del sistema | GitHub → `public/sistema/` — no se tocan |
| Tu sitio publicado | tulavanderia.com.mx |
| Código en la nube | github.com/zamcreativo-lgtm/tulavanderia-web |
| Hospedaje | Cloudflare, Worker `tulavanderia` |
| Cuentas y licencias de clientes | Supabase |
| Cobros | Stripe |
| Correos automáticos | Resend |

---

## 7. Si prefieres botones en vez de comandos

Existe **GitHub Desktop**, un programa gratuito con botones: escribes qué
cambiaste y le das clic a "Push". Sirve para cuando edites archivos en tu
computadora sin querer usar la terminal.

---

## 8. Los comandos, solo si hacen falta

Desde la carpeta `Escritorio\tulavanderia-web` (atajo: escribe `cmd` en la barra
de direcciones del explorador):

| Para qué | Comando |
|---|---|
| Ver el sitio en tu equipo | `node servidor.js` |
| Ver qué cambiaste | `git status` |
| Publicar | `git add -A` luego `git commit -m "tu cambio"` luego `git push` |
| Traer lo que cambiaste en GitHub | `git pull` |
| Deshacer lo no publicado | `git checkout -- .` |
| Ver el historial | `git log --oneline` |

**Importante:** si editas en GitHub desde el navegador y también en tu
computadora, corre `git pull` antes de trabajar en tu equipo. Así bajas lo que
cambiaste desde el navegador y no se encarpetan las versiones.

### Errores que ya te salieron

| Dice | Solución |
|---|---|
| `not a git repository` | Estás en otra carpeta. Usa el atajo del `cmd` |
| `npx : No se puede cargar el archivo` | Usa `node servidor.js` en su lugar |
| `nothing to commit` | No guardaste el archivo. Ctrl+S y vuelve a intentar |
| `no upstream branch` | Ya quedó resuelto, no debería repetirse |
