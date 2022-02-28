import { init, send } from '@emailjs/browser';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Business as BusinessIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  PlaceOutlined as PlaceOutlinedIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import { extractAlt } from '@/assets';
import imageProfile from '@/assets/profile.webp';
import { ConfirmDialog, PrivacyPolicyDialog } from '@/components/dialogs';
import { ChipList, ChipListItem, SectionFadeIn, SectionTitle } from '@/components/elements';
import { meta, sections, styles } from '@/constants';
import { Career, career, Certification, certification, sns } from '@/entities';
import { PendingContext } from '@/pages';
import { createSchema } from '@/schemas/About';
import { handleError } from '@/utils/errors';

const SectionContext = React.createContext(sections.about);
const LocaleContext = React.createContext<{ t: TFunction; code: LocaleCodes }>({ t: () => '', code: localeCodes.jaJp });

const ContextProvider = (props: { children: React.ReactNode }) => {
  const [t, i18n] = useTranslation();
  const section = sections.about;
  return (
    <SectionContext.Provider value={section}>
      <LocaleContext.Provider value={{ t: t, code: i18n.language as LocaleCodes }}>
        {props.children}
      </LocaleContext.Provider>
    </SectionContext.Provider>
  );
};

const ProfileSectionTitle = (props: { children: React.ReactNode; sx?: SxProps<Theme> }) => (
  <Box sx={{ py: 1, borderBottom: 1, borderColor: 'grey.800', ...props.sx }}>
    <Typography variant="h5" sx={{ ml: 1 }}>
      {props.children}
    </Typography>
  </Box>
);

const AuthorArea = (props: { t: TFunction; section: string }) => (
  <Box sx={{ pb: 4, ml: 1 }}>
    <Typography
      sx={{ display: 'inline-block', lineHeight: 1.3, fontSize: { xs: 32, sm: 36 }, fontWeight: 'bold', mr: 2 }}
      data-testid="About__Author__Name"
    >
      {meta.author}
    </Typography>
    <Typography
      sx={{ display: 'inline-block', lineHeight: 1.3, fontSize: { xs: 20, sm: 22 }, color: 'text.secondary' }}
      data-testid="About__Author__Job"
    >
      {props.t(`about__author__job`)}
    </Typography>
  </Box>
);

const SnsArea = (props: { t: TFunction; section: string }) => (
  <>
    {sns.map((sns, i) => (
      <Tooltip key={`${props.section}__sns${i}`} title={sns.name} placement="bottom">
        <IconButton
          color="inherit"
          size="large"
          href={sns.url}
          target="_blank"
          sx={{ mx: { xs: 1, sm: 0.5, md: 1 } }}
          data-testid={`About__SNS${i}`}
        >
          <sns.icon fontSize="large" />
        </IconButton>
      </Tooltip>
    ))}
  </>
);

const CareerArea = (props: { t: TFunction; section: string }) => {
  const theme = useTheme();
  const ltMd = useMediaQuery(theme.breakpoints.down('md'));

  const AdditionalContent = (p: { career: Career; index: number; singleLine: boolean; sx?: SxProps<Theme> }) => {
    const CareerDate = () => (
      <>
        <CalendarTodayOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
        <Typography sx={{ fontSize: 14 }} noWrap data-testid={`About__Career${p.index}__Date`}>
          {p.career.date}
        </Typography>
      </>
    );
    const CareerPlace = () => (
      <>
        <PlaceOutlinedIcon sx={{ fontSize: 16, mr: 0.3 }} />
        <Typography sx={{ fontSize: 14 }} noWrap data-testid={`About__Career${p.index}__Place`}>
          {p.career.place}
        </Typography>
      </>
    );
    return (
      <Box sx={{ ...p.sx }}>
        {p.singleLine ? (
          <Stack direction="row" sx={{ alignItems: 'center', color: 'text.secondary' }}>
            <CareerDate />
            <Box sx={{ ml: 1 }} />
            <CareerPlace />
          </Stack>
        ) : (
          <>
            <Stack direction="row" sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <Box sx={{ ml: 0.1 }} />
              <CareerDate />
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <CareerPlace />
            </Stack>
          </>
        )}
      </Box>
    );
  };

  return (
    <>
      <ProfileSectionTitle>CAREER</ProfileSectionTitle>
      <Timeline
        sx={{
          mt: 0,
          pr: 0,
          pl: 2,
          [`& .${timelineOppositeContentClasses.root}`]: {
            pl: 0,
            flex: 0,
          },
        }}
      >
        {career.map((career, i) => (
          <TimelineItem key={`About__Career${i}`} data-testid={`About__Career${i}`}>
            <TimelineOppositeContent sx={{ mt: 0.5, pr: 0 }}>
              {!ltMd && (
                <Stack width={100}>
                  <AdditionalContent career={career} index={i} singleLine={false} />
                </Stack>
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot sx={{ p: 0, bgcolor: 'common.white' }}>
                {career.favicon ? (
                  <Avatar
                    src={career.favicon}
                    alt={props.t(`about__career__${career.id}__name`)}
                    sx={{ width: 36, height: 36 }}
                    data-testid={`About__Career${i}__Favicon`}
                  />
                ) : (
                  <BusinessIcon
                    sx={{ color: 'grey', width: 32, height: 32, m: 0.25 }}
                    data-testid={`About__Career${i}__Favicon`}
                  />
                )}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0.5, pr: 0, pl: 2 }}>
              {ltMd && <AdditionalContent career={career} index={i} singleLine={true} sx={{ mb: 0.3 }} />}
              <Typography sx={{ fontSize: 16 }} data-testid={`About__Career${i}__Name`}>
                {career.url ? (
                  <Link href={career.url} target="_blank" color="inherit" underline="hover">
                    {props.t(`about__career__${career.id}__name`)}
                  </Link>
                ) : (
                  props.t(`about__career__${career.id}__name`)
                )}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }} data-testid={`About__Career${i}__Body`}>
                {props.t(`about__career__${career.id}__body`)}
              </Typography>
              <ChipList sx={{ mt: 1 }}>
                {career.skills.map((tag, j) => (
                  <ChipListItem key={`About__Career${i}__Skill${j}`} data-testid={`About__Career${i}__Skill${j}`}>
                    <img src={tag} alt={extractAlt(tag)} loading="lazy" decoding="async" />
                  </ChipListItem>
                ))}
              </ChipList>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
};

const CertificationArea = (props: { t: TFunction; section: string }) => {
  const theme = useTheme();
  const ltMd = useMediaQuery(theme.breakpoints.down('md'));

  const AdditionalContent = (p: { certification: Certification; index: number; sx?: SxProps<Theme> }) => {
    return (
      <Stack direction="row" gap={0.5} sx={{ alignItems: 'center', color: 'text.secondary', ...p.sx }}>
        <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: 14 }} noWrap data-testid={`About__Certification${p.index}__Date`}>
          {p.certification.date}
        </Typography>
      </Stack>
    );
  };

  return (
    <>
      <ProfileSectionTitle>CERTIFICATION</ProfileSectionTitle>
      <Timeline
        sx={{
          mt: 0,
          pr: 0,
          pl: 2,
          [`& .${timelineOppositeContentClasses.root}`]: {
            pl: 0,
            flex: 0,
          },
          [`& .${timelineItemClasses.root}`]: {
            minHeight: 0,
          },
        }}
      >
        {certification.map((certification, i) => (
          <TimelineItem key={`${props.section}__Certification${i}`} data-testid={`About__Certification${i}`}>
            <TimelineOppositeContent sx={{ mt: 1.8, pr: 0 }}>
              {!ltMd && (
                <Stack width={100}>
                  <AdditionalContent certification={certification} index={i} sx={{ ml: 0.1 }} />
                </Stack>
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot sx={{ mb: 0, p: 0, bgcolor: 'common.white' }}>
                <Avatar
                  src={certification.favicon}
                  alt={props.t(`about__certification__${certification.id}__name`)}
                  sx={{ width: 36, height: 36 }}
                  data-testid={`About__Certification${i}__Favicon`}
                />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent sx={{ mb: { xs: 1, md: 0 }, mt: 0.5, pr: 0, pl: 2 }}>
              {ltMd && <AdditionalContent certification={certification} index={i} sx={{ mt: -1.5, mb: 0.3 }} />}
              <Typography sx={{ fontSize: 16 }} data-testid={`About__Certification${i}__Name`}>
                <Link href={certification.url} target="_blank" color="inherit" underline="hover">
                  {props.t(`about__certification__${certification.id}__name`)}
                </Link>
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }} data-testid={`About__Certification${i}__Body`}>
                {props.t(`about__certification__${certification.id}__body`)}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
};

const ContactArea = (props: { t: TFunction; section: string }) => {
  const [, setIsPending] = React.useContext(PendingContext);

  const [confirmOpened, setConfirmOpened] = React.useState(false);
  const confirmInquiry = React.useCallback(() => setConfirmOpened(true), []);
  const confirmInquiryCanceled = React.useCallback(() => setConfirmOpened(false), []);

  const [privacyPolicyOpened, setPrivacyPolicyOpened] = React.useState(false);
  const openPrivacyPolicy = React.useCallback(() => setPrivacyPolicyOpened(true), []);
  const closePrivacyPolicy = React.useCallback(() => setPrivacyPolicyOpened(false), []);

  const schema = createSchema();
  const defaultValues = React.useMemo(
    () =>
      ({
        name: '',
        email: '',
        inquiry: '',
      } as InferType<typeof schema>),
    []
  );
  const formMethod = useForm({
    mode: 'all',
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const submit = React.useCallback(
    async (data: InferType<typeof schema>) => {
      try {
        const params = {
          name: data.name,
          email: data.email,
          message: data.inquiry,
        };

        /* istanbul ignore else */
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!);
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          await send(process.env.REACT_APP_EMAILJS_SERVICE_ID!, process.env.REACT_APP_EMAILJS_TEMPLATE_ID!, params);
        } else {
          window.alert(JSON.stringify(params));
        }

        toast.success(props.t('about__contact__send--succeeded'));
        formMethod.reset();
      } catch (e) {
        handleError(e);
      } finally {
        setConfirmOpened(false);
      }
    },
    [formMethod, props]
  );

  // React Hook Form の isSubmitting を Context に伝播させる
  React.useEffect(() => {
    setIsPending(formMethod.formState.isSubmitting);
  }, [setIsPending, formMethod.formState.isSubmitting]);

  return (
    <>
      <ConfirmDialog
        open={confirmOpened}
        title={props.t('about__contact__send--confirm')}
        message={formMethod.getValues('inquiry')}
        affirmativeAction={formMethod.handleSubmit(submit)}
        negativeAction={confirmInquiryCanceled}
        bottomContent={formMethod.formState.isSubmitting && <LinearProgress color="inherit" />}
      />

      <PrivacyPolicyDialog open={privacyPolicyOpened} closeAction={closePrivacyPolicy} />

      <ProfileSectionTitle>CONTACT</ProfileSectionTitle>
      <Box sx={{ px: 1, py: 2 }}>
        <FormControl fullWidth margin="dense">
          <TextField
            {...formMethod.register('name')}
            error={!!formMethod.formState.errors.name}
            helperText={formMethod.formState.errors.name?.message}
            label={props.t('about__contact__name')}
            color="info"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            // HACK: MUI の TextField は内部の input に data-testid を付与する必要がある
            inputProps={{ 'data-testid': 'About__Contact__Name' }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <TextField
            {...formMethod.register('email')}
            error={!!formMethod.formState.errors.email}
            helperText={formMethod.formState.errors.email?.message}
            label={props.t('about__contact__email')}
            color="info"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{ 'data-testid': 'About__Contact__Email' }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <TextField
            {...formMethod.register('inquiry')}
            error={!!formMethod.formState.errors.inquiry}
            helperText={formMethod.formState.errors.inquiry?.message}
            label={props.t('about__contact__message')}
            color="info"
            variant="outlined"
            multiline
            minRows={3}
            maxRows={10}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MessageIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{ 'data-testid': 'About__Contact__Message' }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <Button
            color="info"
            variant="outlined"
            startIcon={<SendIcon />}
            sx={{ mt: 1 }}
            disabled={!formMethod.formState.isValid || formMethod.formState.isSubmitting}
            onClick={confirmInquiry}
            data-testid="About__Contact__Send"
          >
            {props.t('about__contact__send')}
          </Button>
        </FormControl>

        <Typography sx={{ color: 'grey.600', fontSize: 12, mt: 1 }} data-testid="About__Contact__Attention">
          {props.t('about__contact__attention')}
        </Typography>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component="button"
            type="button"
            variant="caption"
            color="text.secondary"
            onClick={openPrivacyPolicy}
            data-testid="About__Contact__PrivacyPolicy"
          >
            {props.t('about__contact__privacyPolicy')}
          </Link>
        </Box>
      </Box>
    </>
  );
};

export const About = (props: { sx?: SxProps<Theme> }) => {
  const { ref, inView } = useInView(styles.intersectionOptions);
  const [t] = useTranslation();
  const section = sections.about;

  return (
    <Box component="section" id={section} sx={{ py: 8, ...props.sx }}>
      <Container>
        <SectionTitle data-testid="About__SectionTitle">{section}</SectionTitle>

        <Box ref={ref}>
          <SectionFadeIn in={inView}>
            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} sm={4} order={{ xs: 0, sm: 1 }}>
                <Avatar
                  src={imageProfile}
                  alt="profile image"
                  variant="rounded"
                  sx={{ width: 'auto', height: 'auto', mx: { xs: 4, sm: 0 } }}
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <SnsArea t={t} section={section} />
                </Box>

                <Box sx={{ mt: 2, display: { xs: 'block', sm: 'none' } }}>
                  <AuthorArea t={t} section={section} />
                  <CareerArea t={t} section={section} />
                  <CertificationArea t={t} section={section} />
                </Box>

                <Box sx={{ mt: { xs: 0.5, sm: 3 } }}>
                  <ContactArea t={t} section={section} />
                </Box>
              </Grid>

              <Grid item xs={12} sm={8} order={{ xs: 1, sm: 0 }} sx={{ display: { xs: 'none', sm: 'block' } }}>
                <AuthorArea t={t} section={section} />
                <CareerArea t={t} section={section} />
                <CertificationArea t={t} section={section} />
              </Grid>
            </Grid>
          </SectionFadeIn>
        </Box>
      </Container>
    </Box>
  );
};
