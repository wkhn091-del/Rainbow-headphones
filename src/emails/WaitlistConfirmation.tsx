import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  email: string;
  earlyAccessCode: string;
};

const bg = "#0c0c0c";
const accent = "#D8D6D2";
const muted = "#94A3B8";
const border = "#2A2C33";

/**
 * Cold Studio transactional — waitlist / 48h early access.
 * Not a marketing blast: mono labels, high contrast, zero promo chrome.
 */
export function WaitlistConfirmation({ email, earlyAccessCode }: Props) {
  return (
    <Html lang="he" dir="rtl">
      <Head />
      <Preview>Nexa Audio · Early Access · {earlyAccessCode}</Preview>
      <Body
        style={{
          backgroundColor: bg,
          margin: 0,
          padding: "48px 16px",
          fontFamily:
            "'IBM Plex Sans Hebrew', 'IBM Plex Sans', Helvetica, Arial, sans-serif",
          color: "#FFFFFF",
        }}
      >
        <Container
          style={{
            maxWidth: 480,
            margin: "0 auto",
            border: `1px solid ${border}`,
            backgroundColor: bg,
            padding: "40px 32px",
          }}
        >
          <Text
            style={{
              margin: 0,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: muted,
            }}
          >
            Nexa Audio
          </Text>

          <Heading
            style={{
              margin: "20px 0 0",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              lineHeight: 1.25,
            }}
          >
            נרשמת לרשימת ההמתנה
          </Heading>

          <Text
            style={{
              margin: "16px 0 0",
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.6,
              color: muted,
            }}
          >
            מלאי ההשקה מוגבל ל־300 יחידות. קוד Early Access שלך תקף ל־48 שעות
            מרגע פתיחת המכירה המוקדמת.
          </Text>

          <Section
            style={{
              marginTop: 28,
              border: `1px solid ${border}`,
              padding: "20px 18px",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                color: muted,
              }}
            >
              Early Access Code
            </Text>
            <Text
              style={{
                margin: "10px 0 0",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 22,
                letterSpacing: "0.28em",
                color: accent,
                direction: "ltr",
                textAlign: "center" as const,
              }}
            >
              {earlyAccessCode}
            </Text>
          </Section>

          <Hr style={{ borderColor: border, margin: "28px 0" }} />

          <Text
            style={{
              margin: 0,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: 11,
              color: muted,
              direction: "ltr",
            }}
          >
            {email}
          </Text>
          <Text
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: muted,
              lineHeight: 1.5,
            }}
          >
            אין צורך להשיב למייל זה. Nexa Pro 3D · Cold Studio
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WaitlistConfirmation;
