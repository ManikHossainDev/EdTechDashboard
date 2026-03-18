import { useState, useEffect } from "react";
import { Tabs, Form, Input, Button, Card, Spin, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import {
  useGetLandingSectionQuery,
  useUpsertLandingSectionMutation,
} from "../../redux/features/landing/landingApi";

// ── Shared helpers ───────────────────────────────────────────────────────────

const ACTIVE_LOCALE = "nb";

const SAVE_BTN_STYLE = { backgroundColor: "#FF9E1C", borderColor: "#FF9E1C" };

function SaveButton({ loading, onClick, label }) {
  return (
    <Button type="primary" size="large" loading={loading} onClick={onClick} style={SAVE_BTN_STYLE}>
      {label}
    </Button>
  );
}

function LoadingBlock() {
  return <div className="flex justify-center py-10"><Spin size="large" /></div>;
}

// ── Contact / Footer Info ─────────────────────────────────────────────────────
function ContactEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("contact");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const [fields, setFields] = useState({ phone: "", email: "", address: "" });

  useEffect(() => {
    if (data) {
      setFields({
        phone:   data.phone   ?? "",
        email:   data.email   ?? "",
        address: data.address ?? "",
      });
    }
  }, [data]);

  const handleChange = (key, value) => setFields((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    try {
      await upsert({ section: "contact", body: fields }).unwrap();
      toast.success("Kontaktinformasjon lagret!");
    } catch {
      toast.error("Kunne ikke lagre kontaktinformasjon.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4 px-3 sm:px-4 lg:max-w-2xl">
      <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        Denne informasjonen vises i bunnteksten på landingssiden. Navigasjonslenker
        administreres direkte i nettstedskoden.
      </p>
      <Form layout="vertical">
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Telefonnummer</span>}>
          <Input
            size="middle"
            value={fields.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+4604328390903"
          />
        </Form.Item>
        <Form.Item label={<span className="font-medium text-sm sm:text-base">E-postadresse</span>}>
          <Input
            size="middle"
            value={fields.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="demo@gmail.com"
          />
        </Form.Item>
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Adresse</span>}>
          <Input.TextArea
            rows={2}
            size="middle"
            value={fields.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Norway"
          />
        </Form.Item>
      </Form>
      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre kontaktinformasjon" />
    </div>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("hero");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const locale = ACTIVE_LOCALE;
  const [fields, setFields] = useState({
    title:    { en: "", nb: "" },
    subtitle: { en: "", nb: "" },
    ctaText:  { en: "", nb: "" },
  });

  useEffect(() => {
    if (data) {
      setFields({
        title:    { en: data.title?.en    ?? "", nb: data.title?.nb    ?? "" },
        subtitle: { en: data.subtitle?.en ?? "", nb: data.subtitle?.nb ?? "" },
        ctaText:  { en: data.ctaText?.en  ?? "", nb: data.ctaText?.nb  ?? "" },
      });
    }
  }, [data]);

  const handleChange = (field, value) =>
    setFields((f) => ({ ...f, [field]: { ...f[field], [locale]: value } }));

  const handleSave = async () => {
    try {
      await upsert({ section: "hero", body: fields }).unwrap();
      toast.success("Hero-seksjon lagret!");
    } catch {
      toast.error("Kunne ikke lagre hero-seksjon.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4 px-3 sm:px-4 lg:max-w-2xl">
      <Form layout="vertical">
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Tittel</span>}>
          <Input
            size="middle"
            value={fields.title[locale]}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Hero-tittel på norsk"
          />
        </Form.Item>
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Undertittel</span>}>
          <Input.TextArea
            rows={3}
            size="middle"
            value={fields.subtitle[locale]}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Hero-undertittel på norsk"
          />
        </Form.Item>
        <Form.Item label={<span className="font-medium text-sm sm:text-base">CTA-knappetekst</span>}>
          <Input
            size="middle"
            value={fields.ctaText[locale]}
            onChange={(e) => handleChange("ctaText", e.target.value)}
            placeholder='f.eks. "Kom i gang"'
          />
        </Form.Item>
      </Form>
      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre hero-seksjon" />
    </div>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
const STEP_LABELS = ["Lær (moduler)", "Bli sertifisert", "Godta (familieavtale)"];

const makeDefaultSteps = () =>
  Array.from({ length: 3 }, (_, i) => ({
    order:       i + 1,
    title:       { en: "", nb: "" },
    description: { en: "", nb: "" },
  }));

function HowItWorksEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("howItWorks");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const locale = ACTIVE_LOCALE;
  const [sectionTitle, setSectionTitle] = useState({ en: "", nb: "" });
  const [steps, setSteps] = useState(makeDefaultSteps());

  useEffect(() => {
    if (data) {
      setSectionTitle({ en: data.sectionTitle?.en ?? "", nb: data.sectionTitle?.nb ?? "" });
      if (data.steps?.length) {
        setSteps(
          Array.from({ length: 3 }, (_, i) => {
            const s = data.steps[i] ?? {};
            return {
              order:       s.order       ?? i + 1,
              title:       { en: s.title?.en       ?? "", nb: s.title?.nb       ?? "" },
              description: { en: s.description?.en ?? "", nb: s.description?.nb ?? "" },
            };
          })
        );
      }
    }
  }, [data]);

  const handleStepChange = (idx, field, value) =>
    setSteps((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, [field]: { ...s[field], [locale]: value } } : s
      )
    );

  const handleSave = async () => {
    try {
      await upsert({ section: "howItWorks", body: { sectionTitle, steps } }).unwrap();
      toast.success("Slik fungerer det lagret!");
    } catch {
      toast.error("Kunne ikke lagre Slik fungerer det.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <Form layout="vertical">
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Seksjonstittel</span>}>
          <Input
            size="middle"
            value={sectionTitle[locale]}
            onChange={(e) => setSectionTitle((s) => ({ ...s, [locale]: e.target.value }))}
            placeholder='f.eks. "Slik fungerer det"'
          />
        </Form.Item>
      </Form>
      {steps.map((step, idx) => (
        <Card
          key={idx}
          size="small"
          title={<span className="font-semibold text-sm sm:text-base">Steg {idx + 1} — {STEP_LABELS[idx]}</span>}
          className="mb-3 sm:mb-4 border-[#FF9E1C]/30"
        >
          <Form layout="vertical">
            <Form.Item label={<span className="font-medium">Stegtittel</span>}>
              <Input
                value={step.title[locale]}
                onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                placeholder="Stegtittel på norsk"
              />
            </Form.Item>
            <Form.Item label={<span className="font-medium">Beskrivelse</span>}>
              <Input.TextArea
                rows={2}
                value={step.description[locale]}
                onChange={(e) => handleStepChange(idx, "description", e.target.value)}
                placeholder="Beskrivelse på norsk"
              />
            </Form.Item>
          </Form>
        </Card>
      ))}
      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre Slik fungerer det" />
    </div>
  );
}

// ── Features List (8 Module Cards) ───────────────────────────────────────────
const makeDefaultFeatureItems = () =>
  Array.from({ length: 8 }, (_, i) => ({
    moduleNo:    i + 1,
    title:       { en: "", nb: "" },
    description: { en: "", nb: "" },
    icon:        "",
    time:        "",
  }));

function FeaturesEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("features");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const locale = ACTIVE_LOCALE;
  const [sectionTitle, setSectionTitle] = useState({ en: "", nb: "" });
  const [description, setDescription] = useState({ en: "", nb: "" });
  const [items, setItems] = useState(makeDefaultFeatureItems());

  useEffect(() => {
    if (data) {
      setSectionTitle({ en: data.sectionTitle?.en ?? "", nb: data.sectionTitle?.nb ?? "" });
      setDescription({ en: data.description?.en ?? "", nb: data.description?.nb ?? "" });
      if (data.items?.length) {
        setItems(
          Array.from({ length: 8 }, (_, i) => {
            const item = data.items[i] ?? {};
            return {
              moduleNo:    item.moduleNo    ?? i + 1,
              title:       { en: item.title?.en       ?? "", nb: item.title?.nb       ?? "" },
              description: { en: item.description?.en ?? "", nb: item.description?.nb ?? "" },
              icon:        item.icon  ?? "",
              time:        item.time  ?? "",
            };
          })
        );
      }
    }
  }, [data]);

  const handleItemChange = (idx, field, value) =>
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        // plain string fields
        if (field === "icon" || field === "time") return { ...item, [field]: value };
        // L10n fields
        return { ...item, [field]: { ...item[field], [locale]: value } };
      })
    );

  const handleSave = async () => {
    try {
      await upsert({ section: "features", body: { sectionTitle, description, items } }).unwrap();
      toast.success("Funksjonsliste lagret!");
    } catch {
      toast.error("Kunne ikke lagre funksjoner.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4 px-3 sm:px-4 lg:max-w-2xl">
      <Card title={<span className="font-semibold text-sm sm:text-base">Seksjonshode</span>} size="small" className="border-[#FF9E1C]/30 mb-3 sm:mb-4">
        <Form layout="vertical">
          <Form.Item label={<span className="font-medium text-sm sm:text-base">Seksjonstittel</span>}>
            <Input
              size="middle"
              value={sectionTitle[locale]}
              onChange={(e) => setSectionTitle((s) => ({ ...s, [locale]: e.target.value }))}
              placeholder='f.eks. "8 spennende læringsmoduler 🔥"'
            />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-sm sm:text-base">Seksjonsbeskrivelse</span>}>
            <Input.TextArea
              rows={2}
              value={description[locale]}
              onChange={(e) => setDescription((s) => ({ ...s, [locale]: e.target.value }))}
              placeholder="Seksjonsbeskrivelse på norsk"
            />
          </Form.Item>
        </Form>
      </Card>

      <Divider orientation="left">Funksjonselementer (8 moduler)</Divider>

      {items.map((item, idx) => (
        <Card
          key={idx}
          size="small"
          title={<span className="font-semibold text-sm sm:text-base">Modul {item.moduleNo}</span>}
          className="mb-3 sm:mb-4 border-[#FF9E1C]/30"
        >
          <Form layout="vertical">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Form.Item label={<span className="font-medium text-xs sm:text-sm">Ikon (emoji)</span>} className="mb-2">
                <Input
                  value={item.icon}
                  onChange={(e) => handleItemChange(idx, "icon", e.target.value)}
                  placeholder="f.eks. 📱"
                />
              </Form.Item>
              <Form.Item label={<span className="font-medium text-xs sm:text-sm">Tid</span>} className="mb-2">
                <Input
                  value={item.time}
                  onChange={(e) => handleItemChange(idx, "time", e.target.value)}
                  placeholder="f.eks. 15 min"
                />
              </Form.Item>
            </div>
            <Form.Item label={<span className="font-medium text-sm sm:text-base">Funksjonstittel</span>}>
              <Input
                size="middle"
                value={item.title[locale]}
                onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                placeholder="Funksjonstittel på norsk"
              />
            </Form.Item>
            <Form.Item label={<span className="font-medium text-sm sm:text-base">Funksjonsbeskrivelse</span>}>
              <Input.TextArea
                rows={2}
                value={item.description[locale]}
                onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                placeholder="Beskrivelse på norsk"
              />
            </Form.Item>
          </Form>
        </Card>
      ))}

      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre funksjonsliste" />
    </div>
  );
}

// ── Benefits (Get Your Child Mobile Ready) ────────────────────────────────────
const makeDefaultBenefitItems = () =>
  Array.from({ length: 3 }, () => ({ text: { en: "", nb: "" } }));

function BenefitsEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("benefits");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const locale = ACTIVE_LOCALE;
  const [sectionTitle, setSectionTitle] = useState({ en: "", nb: "" });
  const [items, setItems] = useState(makeDefaultBenefitItems());

  useEffect(() => {
    if (data) {
      setSectionTitle({ en: data.sectionTitle?.en ?? "", nb: data.sectionTitle?.nb ?? "" });
      if (data.benefitItems?.length || data.items?.length) {
        const src = data.benefitItems ?? data.items ?? [];
        setItems(src.map((b) => ({ text: { en: b.text?.en ?? "", nb: b.text?.nb ?? "" } })));
      }
    }
  }, [data]);

  const handleItemChange = (idx, value) =>
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { text: { ...item.text, [locale]: value } } : item
      )
    );

  const addItem = () =>
    setItems((prev) => [...prev, { text: { en: "", nb: "" } }]);

  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    try {
      await upsert({ section: "benefits", body: { sectionTitle, items } }).unwrap();
      toast.success("Fordelsseksjon lagret!");
    } catch {
      toast.error("Kunne ikke lagre fordeler.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <Form layout="vertical">
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Seksjonstittel</span>}>
          <Input
            size="middle"
            value={sectionTitle[locale]}
            onChange={(e) => setSectionTitle((s) => ({ ...s, [locale]: e.target.value }))}
            placeholder='f.eks. "Gjør barnet ditt mobilklart 🔥"'
          />
        </Form.Item>
      </Form>

      <Divider orientation="left">Fordelspunkter</Divider>

      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
          <div className="flex-1">
            <Input.TextArea
              rows={2}
              value={item.text[locale]}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              placeholder={`Fordel ${idx + 1} på norsk`}
              className="flex-1"
            />
          </div>
          {items.length > 1 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeItem(idx)}
              className="mt-0 sm:mt-1"
            />
          )}
        </div>
      ))}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addItem}
        className="w-full mb-4"
      >
        Legg til fordel
      </Button>

      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre fordelsseksjon" />
    </div>
  );
}

// ── Why Mobilklar (4 Pillars) ─────────────────────────────────────────────────
const PILLAR_LABELS = ["Søyle 1", "Søyle 2", "Søyle 3", "Søyle 4"];

const makeDefaultPillars = () =>
  PILLAR_LABELS.map(() => ({
    title:       { en: "", nb: "" },
    description: { en: "", nb: "" },
    icon:        "",
  }));

function WhyMobilklarEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("whyMobilklar");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const locale = ACTIVE_LOCALE;
  const [sectionTitle, setSectionTitle] = useState({ en: "", nb: "" });
  const [subtitle, setSubtitle] = useState({ en: "", nb: "" });
  const [pillars, setPillars] = useState(makeDefaultPillars());

  useEffect(() => {
    if (data) {
      setSectionTitle({ en: data.sectionTitle?.en ?? "", nb: data.sectionTitle?.nb ?? "" });
      setSubtitle({ en: data.subtitle?.en ?? "", nb: data.subtitle?.nb ?? "" });
      if (data.pillars?.length) {
        setPillars(
          Array.from({ length: 4 }, (_, i) => {
            const p = data.pillars[i] ?? {};
            return {
              title:       { en: p.title?.en       ?? "", nb: p.title?.nb       ?? "" },
              description: { en: p.description?.en ?? "", nb: p.description?.nb ?? "" },
              icon:        p.icon ?? "",
            };
          })
        );
      }
    }
  }, [data]);

  const handlePillarChange = (idx, field, value) =>
    setPillars((prev) =>
      prev.map((p, i) => {
        if (i !== idx) return p;
        if (field === "icon") return { ...p, icon: value };
        return { ...p, [field]: { ...p[field], [locale]: value } };
      })
    );

  const handleSave = async () => {
    try {
      await upsert({ section: "whyMobilklar", body: { sectionTitle, subtitle, pillars } }).unwrap();
      toast.success("Hvorfor Mobilklar lagret!");
    } catch {
      toast.error("Kunne ikke lagre Hvorfor Mobilklar.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <Form layout="vertical">
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Seksjonstittel</span>}>
          <Input
            size="middle"
            value={sectionTitle[locale]}
            onChange={(e) => setSectionTitle((s) => ({ ...s, [locale]: e.target.value }))}
            placeholder='f.eks. "Hvorfor Mobilklar?"'
          />
        </Form.Item>
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Seksjonsundertittel</span>}>
          <Input
            size="middle"
            value={subtitle[locale]}
            onChange={(e) => setSubtitle((s) => ({ ...s, [locale]: e.target.value }))}
            placeholder='f.eks. "Bygget for barn i alderen 8–13"'
          />
        </Form.Item>
      </Form>

      <Divider orientation="left">4 søyler</Divider>

      {pillars.map((pillar, idx) => (
        <Card
          key={idx}
          size="small"
          title={<span className="font-semibold text-sm sm:text-base">{PILLAR_LABELS[idx]}</span>}
          className="mb-3 sm:mb-4 border-[#FF9E1C]/30"
        >
          <Form layout="vertical">
            <Form.Item label={<span className="font-medium text-xs sm:text-sm">Ikon (emoji)</span>}>
              <Input
                size="middle"
                value={pillar.icon}
                onChange={(e) => handlePillarChange(idx, "icon", e.target.value)}
                placeholder="f.eks. 🔒"
              />
            </Form.Item>
            <Form.Item label={<span className="font-medium text-sm sm:text-base">Søyletittel</span>}>
              <Input
                size="middle"
                value={pillar.title[locale]}
                onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                placeholder="Tittel på norsk"
              />
            </Form.Item>
            <Form.Item label={<span className="font-medium text-sm sm:text-base">Søylebeskrivelse</span>}>
              <Input.TextArea
                rows={2}
                value={pillar.description[locale]}
                onChange={(e) => handlePillarChange(idx, "description", e.target.value)}
                placeholder="Beskrivelse på norsk"
              />
            </Form.Item>
          </Form>
        </Card>
      ))}
      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre Hvorfor Mobilklar" />
    </div>
  );
}

// ── Quote ─────────────────────────────────────────────────────────────────────
function QuoteEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("quote");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const locale = ACTIVE_LOCALE;
  const [fields, setFields] = useState({
    title:  { en: "", nb: "" },
    text:   { en: "", nb: "" },
    author: { en: "", nb: "" },
  });

  useEffect(() => {
    if (data) {
      setFields({
        title:  { en: data.title?.en   ?? "", nb: data.title?.nb   ?? "" },
        text:   { en: data.text?.en    ?? "", nb: data.text?.nb    ?? "" },
        author: { en: data.author?.en  ?? "", nb: data.author?.nb  ?? "" },
      });
    }
  }, [data]);

  const handleChange = (field, value) =>
    setFields((f) => ({ ...f, [field]: { ...f[field], [locale]: value } }));

  const handleSave = async () => {
    try {
      await upsert({ section: "quote", body: fields }).unwrap();
      toast.success("Sitat lagret!");
    } catch {
      toast.error("Kunne ikke lagre sitat.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <Form layout="vertical">
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Seksjonstittel</span>}>
          <Input
            size="middle"
            value={fields.title[locale]}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder='f.eks. "Foreldreomtaler"'
          />
        </Form.Item>
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Sitattekst</span>}>
          <Input.TextArea
            rows={3}
            size="middle"
            value={fields.text[locale]}
            onChange={(e) => handleChange("text", e.target.value)}
            placeholder="Sitat på norsk"
          />
        </Form.Item>
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Forfatternavn / tittel</span>}>
          <Input
            size="middle"
            value={fields.author[locale]}
            onChange={(e) => handleChange("author", e.target.value)}
            placeholder='f.eks. "Dr. Emily Parker, barnepsykolog"'
          />
        </Form.Item>
      </Form>
      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre sitat" />
    </div>
  );
}

// ── About Us ──────────────────────────────────────────────────────────────────
const makeDefaultParagraphs = (n = 2) =>
  Array.from({ length: n }, (_, i) => ({ order: i + 1, text: { en: "", nb: "" } }));

function AboutEditor() {
  const { data, isLoading } = useGetLandingSectionQuery("about");
  const [upsert, { isLoading: isSaving }] = useUpsertLandingSectionMutation();
  const locale = ACTIVE_LOCALE;
  const [title, setTitle] = useState({ en: "", nb: "" });
  const [paragraphs, setParagraphs] = useState(makeDefaultParagraphs());

  useEffect(() => {
    if (data) {
      setTitle({ en: data.title?.en ?? "", nb: data.title?.nb ?? "" });
      if (data.paragraphs?.length) {
        setParagraphs(
          data.paragraphs.map((p, i) => ({
            order: p.order ?? i + 1,
            text:  { en: p.text?.en ?? "", nb: p.text?.nb ?? "" },
          }))
        );
      }
    }
  }, [data]);

  const handleParagraphChange = (idx, value) =>
    setParagraphs((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, text: { ...p.text, [locale]: value } } : p
      )
    );

  const addParagraph = () =>
    setParagraphs((prev) => [
      ...prev,
      { order: prev.length + 1, text: { en: "", nb: "" } },
    ]);

  const removeParagraph = (idx) =>
    setParagraphs((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((p, i) => ({ ...p, order: i + 1 }))
    );

  const handleSave = async () => {
    try {
      await upsert({ section: "about", body: { title, paragraphs } }).unwrap();
      toast.success("Om oss lagret!");
    } catch {
      toast.error("Kunne ikke lagre Om oss.");
    }
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <Form layout="vertical">
        <Form.Item label={<span className="font-medium text-sm sm:text-base">Sidetittel</span>}>
          <Input
            size="middle"
            value={title[locale]}
            onChange={(e) => setTitle((t) => ({ ...t, [locale]: e.target.value }))}
            placeholder='f.eks. "Om oss"'
          />
        </Form.Item>
      </Form>

      <Divider orientation="left">Innholdsavsnitt</Divider>

      {paragraphs.map((p, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Avsnitt {idx + 1}</p>
            <Input.TextArea
              rows={4}
              value={p.text[locale]}
              onChange={(e) => handleParagraphChange(idx, e.target.value)}
              placeholder={`Avsnitt ${idx + 1} på norsk`}
            />
          </div>
          {paragraphs.length > 1 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeParagraph(idx)}
              className="mt-0 sm:mt-8"
            />
          )}
        </div>
      ))}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addParagraph}
        className="w-full mb-4"
      >
        Legg til avsnitt
      </Button>

      <SaveButton loading={isSaving} onClick={handleSave} label="Lagre Om oss" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TAB_ITEMS = [
  { key: "hero",         label: "Hero-seksjon",         children: <HeroEditor /> },
  { key: "howItWorks",   label: "Slik fungerer det",    children: <HowItWorksEditor /> },
  { key: "features",     label: "Funksjoner (moduler)", children: <FeaturesEditor /> },
  { key: "benefits",     label: "Fordeler",             children: <BenefitsEditor /> },
  { key: "whyMobilklar", label: "Hvorfor Mobilklar",    children: <WhyMobilklarEditor /> },
  { key: "quote",        label: "Sitat",                children: <QuoteEditor /> },
  { key: "about",        label: "Om oss",               children: <AboutEditor /> },
  { key: "contact",      label: "Kontakt (bunntekst)",  children: <ContactEditor /> },
];

export default function LandingPage() {
  return (
    <section className="w-full min-h-screen px-3 sm:px-4 md:px-6">
      <div className="py-3 sm:py-4 md:py-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Innhold for landingsside</h1>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
          Rediger seksjoner på landingssiden på norsk (NB). Navigasjonslenker styres i
          nettstedskoden og kan ikke endres her.
        </p>
      </div>
      <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm overflow-x-auto">
        <Tabs defaultActiveKey="hero" type="card" items={TAB_ITEMS} />
      </div>
    </section>
  );
}
