import { NextResponse, after } from "next/server";
import { prisma } from '@/lib/prisma';
import nodemailer from "nodemailer";

function makeOrderNumber() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PED-${day}${month}${year}-${random}`;
}

function makeOrderId() {
  return `ORD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function formatOrderItems(items: any[]) {
  return items.map(item =>
    `
    <div style="margin-bottom:15px;">
      <strong>${item.nome}</strong><br/>
      Cor: ${item.cor || 'Não informado'}<br/>
      Tamanho: ${item.tamanho || 'Não informado'}<br/>
      Quantidade: ${item.quantidade}<br/>
      Subtotal: R$ ${item.subtotal.toFixed(2)}<br/>
      Personalização: ${item.personalizacao || 'Nenhuma'}
    </div>
    `
  ).join('');
}

async function sendOrderEmail(
  orderNumber: string,
  orderId: string,
  items: any,
  total: number,
  observacoes?: string | null,
  cliente?: {
    nome?: string;
    email?: string;
  }
) {
  const to = process.env.ORDER_EMAIL_TO || process.env.NEXT_PUBLIC_STORE_EMAIL;
  const from = process.env.ORDER_EMAIL_FROM || 'vendas@fiosefitas.com.br';
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!to || !smtpHost || !smtpUser || !smtpPass) {
    console.error("SMTP incompleto", {
      to,
      smtpHost,
      smtpUser,
      hasPass: !!smtpPass,
    });

    return { 
      ok: false, 
      skipped: true 
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"Fios e Fitas" <${smtpUser}>`,
      replyTo: from ,
      to,
      subject: `Novo pedido ${orderNumber}`,
      html: `
        <h2>🛒 Novo pedido recebido</h2>

        <hr/>

        <h3>Cliente:</h3>

        <p>
          <strong>Nome:</strong>
          ${cliente?.nome || 'Não informado'}
        </p>

        <p>
          <strong>E-mail:</strong>
          ${cliente?.email || 'Não informado'}
        </p>

        <p>
          <strong>Número do pedido:</strong>
          ${orderNumber}
        </p>

        <p>
          <strong>ID do pedido:</strong>
          ${orderId}
        </p>

        <h3>Itens:</h3>

        ${formatOrderItems(items)}

        <hr/>

        <h3>Total: R$ ${total.toFixed(2)}</h3>

        <p>
          <strong>Observações:</strong><br/>
          ${observacoes || 'Nenhuma'}
        </p>
      `
    });

    if (cliente?.email) {
      const customerMail = await transporter.sendMail({
        from: `"Fios e Fitas" <vendas@fiosefitas.com.br>`,
        to: cliente.email,
        replyTo: from ,
        subject: `Pedido recebido - ${orderNumber}`,
        html: `
          <h2>🛒 Recebemos seu pedido!</h2>

          <p>
            Olá ${cliente.nome || ''}, seu pedido foi recebido com sucesso.
          </p>

          <hr/>

          <h3>Itens:</h3>

          ${formatOrderItems(items)}

          <hr/>

          <h3>Total: R$ ${total.toFixed(2)}</h3>

          <p>
            <strong>Observações:</strong><br/>
            ${observacoes || 'Nenhuma'}
          </p>

          <p>
            Obrigado pela preferência ❤️
          </p>
        `
      });
    }

    return { ok: true, skipped: false };
  } catch (error) {
    console.error('Failed to send order email', error);
    return { ok: true, skipped: false, error };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, observacoes, cliente } = body ?? {};

    if (!Array.isArray(items) || typeof total !== 'number') {
      return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
    }

    const orderNumber = makeOrderNumber();
    const orderId = makeOrderId();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        orderId,
        items,
        total,
        observacoes: observacoes ?? null,

        clienteNome: cliente?.nome ?? null,
        clienteEmail: cliente?.email ?? null,
      },
    });
    const mensagem = encodeURIComponent(
      `Olá! Quero confirmar meu pedido.

      Número do pedido: ${orderNumber}

      Obrigado!`
      );

      const whatsappUrl = `https://wa.me/5583998660454?text=${mensagem}`;

    after(async () => {
      try {
        await sendOrderEmail(
          orderNumber,
          order.orderId,
          order.items,
          order.total,
          order.observacoes,
          cliente
        );
      } catch (error) {
        console.error("Erro ao enviar email:", error);
      }
    });

    return NextResponse.json({ ok: true, order, whatsappUrl });
  } catch (error) {
    console.error('Failed to create order', error);
    return NextResponse.json({ error: 'Erro ao criar pedido.' }, { status: 500 });
  }
}
