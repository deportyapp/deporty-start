import matplotlib.pyplot as plt
import numpy as np

fig, axs = plt.subplots(2, 2, figsize=(12, 10))
fig.suptitle('Gráficas de las funciones según sus límites', fontsize=16)

# Función para configurar cada subgráfico
def setup_ax(ax, title):
    ax.set_title(title)
    ax.axhline(0, color='black',linewidth=1)
    ax.axvline(0, color='black',linewidth=1)
    ax.grid(color = 'gray', linestyle = '--', linewidth = 0.5)

# CASO A
ax = axs[0, 0]
setup_ax(ax, 'Caso A')
ax.plot([-1, 1], [0, 2], 'b-') # Izquierda
ax.plot([1, 3], [-2, 0], 'b-') # Derecha
ax.plot(1, 2, 'bo') # Punto cerrado
ax.plot(1, -2, 'wo', markeredgecolor='b') # Punto abierto

# CASO B
ax = axs[0, 1]
setup_ax(ax, 'Caso B')
ax.plot([-2, 0], [1, 1], 'b-') # x -> 0-
ax.plot([0, 2], [-1, 0], 'b-') # x -> 0+ hasta x -> 2-
ax.plot([2, 4], [0, 1], 'b-') # x -> 2+
ax.plot(0, 1, 'wo', markeredgecolor='b') # Punto abierto
ax.plot(0, -1, 'wo', markeredgecolor='b') # Punto abierto
ax.plot(2, 0, 'wo', markeredgecolor='b') # Punto abierto en limite
ax.plot(2, 1, 'bo') # Punto cerrado g(2)=1

# CASO C
ax = axs[1, 0]
setup_ax(ax, 'Caso C')
ax.plot([-4, -2], [0, 2], 'b-') # x -> -2 por izquierda
ax.plot([-2, 3], [2, 2], 'b-') # x -> -2 por derecha hasta x -> 3-
ax.plot([3, 5], [4, 5], 'b-') # x -> 3+
ax.plot(-2, 2, 'wo', markeredgecolor='b') # Punto abierto en limite
ax.plot(-2, 1, 'bo') # Punto cerrado g(-2)=1
ax.plot(3, 2, 'wo', markeredgecolor='b') # Punto abierto
ax.plot(3, 4, 'wo', markeredgecolor='b') # Punto abierto
ax.plot(3, 3, 'bo') # Punto cerrado g(3)=3

# CASO D
ax = axs[1, 1]
setup_ax(ax, 'Caso D')
ax.plot([-1, 1], [1, 3], 'b-') # x -> 1 por izquierda
ax.plot([1, 4], [3, 3], 'b-') # x -> 1 por derecha hasta x -> 4-
ax.plot([4, 6], [-3, -1], 'b-') # x -> 4+
ax.plot(1, 3, 'wo', markeredgecolor='b') # Punto abierto en limite
ax.plot(1, 1, 'bo') # Punto cerrado g(1)=1
ax.plot(4, 3, 'wo', markeredgecolor='b') # Punto abierto
ax.plot(4, -3, 'wo', markeredgecolor='b') # Punto abierto
ax.plot(4, -1, 'bo') # Punto cerrado g(4)=-1

plt.tight_layout()
plt.savefig('graficas_limites.png', dpi=150, bbox_inches='tight')
print("Gráficas guardadas como 'graficas_limites.png'")
plt.show()
