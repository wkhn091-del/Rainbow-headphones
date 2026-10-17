import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type Props = {
  email: string;
  orderId: string;
  amountIls: number;
};

const bg = "#0c0c0c";
const accent = "#D8D6D2";
const muted = "#94A3B8";
const border = "#2A2C33";

export function OrderConfirmation({ email, orderId, amountIls }: Props) {
  return (
    <Html lang="he" dir="rtl">
      <Head />
      <Preview>Nexa Audio · אישור הזמנה · {orderId.slice(0, 8)}</Preview>
      <Body
        style={{
          backgroundColor: bg,
          margin: 0,
          padding: "48px 16px",
          fontFamily:
            "'IBM Plex Sans Hebrew', Helvetica, Arial, sans-serif",
          color: "#FFFFFF",
        }}
      >
        <Container
          style={{
            maxWidth: 480,
            margin: "0 auto",
            border: `1px solid ${border}`,
            padding: "40px 32px",
          }}
        >
          <Text
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: muted,
            }}
          >
            Nexa Audio · Order
          </Text>
          <Heading
            style={{
              margin: "20px 0 0",
              fontSize: 22,
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            התשלום התקבל
          </Heading>
          <Text style={{ margin: "16px 0 0", fontSize: 14, color: muted }}>
            סכום{" "}
            <span style={{ color: accent }} dir="ltr">
              ₪{amountIls.toLocaleString("he-IL")}
            </span>{" "}
            · מספר הזמנה{" "}
            <span dir="ltr" style={{ color: accent }}>
              {orderId.slice(0, 8)}
            </span>
          </Text>
          <Hr style={{ borderColor: border, margin: "28px 0" }} />
          <Text style={{ margin: 0, fontSize: 12, color: muted }} dir="ltr">
            {email}
          </Text>
          <Text style={{ margin: "8px 0 0", fontSize: 12, color: muted }}>
            חשבונית Morning תישלח בנפרד כשהמערכת מחוברת.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmation;
